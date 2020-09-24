/****************************************************************************
 Copyright (c) 2010-2013 cocos2d-x.org
 Copyright (c) 2013-2017 Chukong Technologies Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
****************************************************************************/

#import "AppController.h"
#import "cocos2d.h"
#import "AppDelegate.h"
#import "RootViewController.h"
#import "platform/ios/CCEAGLView-ios.h"

#import "cocos-analytics/CAAgent.h"

#include "cocos/scripting/js-bindings/jswrapper/SeApi.h"
using namespace cocos2d;

@implementation AppController

@synthesize window;

#pragma mark -
#pragma mark Application lifecycle

// cocos2d application instance
static AppDelegate* s_sharedApplication = nullptr;

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

    [CAAgent enableDebug:NO];

    if (s_sharedApplication == nullptr)
    {
        s_sharedApplication = new (std::nothrow) AppDelegate();
    }
    cocos2d::Application *app = cocos2d::Application::getInstance();

    // Initialize the GLView attributes
    app->initGLContextAttrs();
    cocos2d::GLViewImpl::convertAttrs();

    // Override point for customization after application launch.

    // Add the view controller's view to the window and display.
    window = [[UIWindow alloc] initWithFrame: [[UIScreen mainScreen] bounds]];

    // Use RootViewController to manage CCEAGLView
    _viewController = [[RootViewController alloc]init];
    _viewController.wantsFullScreenLayout = YES;


    // Set RootViewController to window
    if ( [[UIDevice currentDevice].systemVersion floatValue] < 6.0)
    {
        // warning: addSubView doesn't work on iOS6
        [window addSubview: _viewController.view];
    }
    else
    {
        // use this method on ios6
        [window setRootViewController:_viewController];
    }

    [window makeKeyAndVisible];

    [[UIApplication sharedApplication] setStatusBarHidden:YES];
    [UIApplication sharedApplication].idleTimerDisabled = true;

    // IMPORTANT: Setting the GLView should be done after creating the RootViewController
    cocos2d::GLView *glview = cocos2d::GLViewImpl::createWithEAGLView((__bridge void *)_viewController.view);
    cocos2d::Director::getInstance()->setOpenGLView(glview);

    //向微信注册
    [WXApi registerApp:@"wx82256d3bda922e13" universalLink:@"https://tjgosd.xinstall.top/tolink/"];
    
    //注册高德地图定位
    [AMapServices sharedServices].apiKey = @"c9e271f2f4216a766fb65e3570948733";
    
    self.locationManager = [[AMapLocationManager alloc] init];
    self.locationManager.delegate = self;
//    self.locationManager.distanceFilter ＝ 200;
    //设置允许连续定位逆地理
    [self.locationManager setLocatingWithReGeocode:YES];
    
    //iOS 9（不包含iOS 9） 之前设置允许后台定位参数，保持不会被系统挂起
    [self.locationManager setPausesLocationUpdatesAutomatically:NO];

    //iOS 9（包含iOS 9）之后新特性：将允许出现这种场景，同一app中多个locationmanager：一些只能在前台定位，另一些可在后台定位，并可随时禁止其后台定位。
    if ([[[UIDevice currentDevice] systemVersion] floatValue] >= 9) {
        self.locationManager.allowsBackgroundLocationUpdates = YES;
    }
    //开始持续定位
    [self.locationManager startUpdatingLocation];
    
    
    UIDevice * device = [UIDevice currentDevice];
    [device setBatteryMonitoringEnabled:YES];
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(didChangeBatteryLevel:) name:@"UIDeviceBatteryLevelDidChangeNotification" object:device];
    
    //run the cocos2d-x game scene
    app->run();

    return YES;
}

+ (float)starBatteryReceiver
{
    UIDevice * device = [UIDevice currentDevice];
    [device setBatteryMonitoringEnabled:YES];
    return [device batteryLevel]*100;
}

- (void)didChangeBatteryLevel:(id)sender{
    UIDevice *device = [UIDevice currentDevice];
    [device setBatteryMonitoringEnabled:YES];
    float batteryLevel = [device batteryLevel]*100;
    NSString *batteryLevelStr = [NSString stringWithFormat:@"%f",batteryLevel];
    NSLog(@"didChangeBatteryLevel:%@", batteryLevelStr);
    [self iosCallJs:@"Global.GetBatteryChange" :batteryLevelStr];
}

- (void)amapLocationManager:(AMapLocationManager *)manager didUpdateLocation:(CLLocation *)location reGeocode:(AMapLocationReGeocode *)reGeocode
{
    NSLog(@"location:{lat:%f; lon:%f; district:%@}", location.coordinate.latitude, location.coordinate.longitude, reGeocode.district);
    NSString *GPSDataStr = [NSString stringWithFormat:@"%f,%f,%@", location.coordinate.longitude,location.coordinate.latitude,reGeocode.district];
    [self iosCallJs:@"Global.GetGPSData" :GPSDataStr];
}

- (void)amapLocationManager:(AMapLocationManager *)manager doRequireLocationAuth:(CLLocationManager*)locationManager
{
    [locationManager requestAlwaysAuthorization];
}

- (BOOL)application:(UIApplication *)application handleOpenURL:(NSURL *)url {
    return  [WXApi handleOpenURL:url delegate:self];
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
    return [WXApi handleOpenURL:url delegate:self];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void(^)(NSArray<id<UIUserActivityRestoring>> * __nullable restorableObjects))restorationHandler
{
    return [WXApi handleOpenUniversalLink:userActivity delegate:self];
}

-(void) onReq:(BaseReq*)reqonReq
{

}

-(void) onResp:(BaseResp*)resp{
    if([resp isKindOfClass:[SendAuthResp class]])
    {
        SendAuthResp *aresp = (SendAuthResp *)resp;
        if (aresp.errCode== 0) {
            [self iosCallJs:@"Global.WXCode" :aresp.code];  //此处的cc.jsEngineCallback是creator里面js定义的全局函数
        }
    }
}

//定义参数的返回
-(void)iosCallJs:(NSString*) funcNameStr :(NSString*) contentStr
{
    std::string funcName = [funcNameStr UTF8String];
    std::string param = [contentStr UTF8String];
    std::string jsCallStr = cocos2d::StringUtils::format("%s(\"%s\");",funcName.c_str(), param.c_str());
    se::ScriptEngine::getInstance()->evalString(jsCallStr.c_str());
}

+ (BOOL)isWXAppInstalled
{
    return [WXApi isWXAppInstalled];
}

+ (BOOL)onWxAuthorize
{
    SendAuthReq *req = [[[SendAuthReq alloc] init]autorelease];
    req.scope = @"snsapi_userinfo";
    req.state = @"kkgame";
    [WXApi sendReq:req completion:^(BOOL success) { NSLog(@"onWxAuthorize:%@", success ? @"成功" : @"失败");  }];
    return  true;
}

+ (int) getWxShareScene:(NSString*) shareSceneType
{
    if ([shareSceneType isEqualToString:@"WXSceneSession"]) {
        return WXScene::WXSceneSession;
    } else if ([shareSceneType isEqualToString:@"WXSceneTimeline"]) {
        return WXScene::WXSceneTimeline;
    } else {
        return WXScene::WXSceneFavorite;
    }
}

+ (BOOL)onWXShareText:(NSString*)shareSceneType title:(NSString*)title description:(NSString*)description
{
    SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
    req.bText = YES;
    req.text = description;
    req.scene = [self getWxShareScene:shareSceneType];

    [WXApi sendReq:req completion:^(BOOL success) { NSLog(@"onWXShareText:%@", success ? @"成功" : @"失败");  }];
    return  true;
}

+ (BOOL)onWXShareImage:(NSString*)shareSceneType imgPath:(NSString*)imgPath
{
    UIImage *temp_img = [UIImage imageWithContentsOfFile:imgPath];
    UIImage *thumbImage = [AppController scaleToSize:CGSizeMake(320, 320) Target:temp_img];
                               
    WXImageObject *imageObject = [WXImageObject object];
    imageObject.imageData = [NSData dataWithContentsOfFile:imgPath];

    WXMediaMessage *message = [WXMediaMessage message];
    message.mediaObject = imageObject;
    [message setThumbImage:thumbImage];
    
    SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
    req.bText = NO;
    req.message = message;
    req.scene = [self getWxShareScene:shareSceneType];

    [WXApi sendReq:req completion:^(BOOL success) { NSLog(@"onWXShareImage:%@", success ? @"成功" : @"失败");  }];
    return  true;
}

+(UIImage*)scaleToSize:(CGSize)size Target:(UIImage*)target_img
{
    CGFloat width = target_img.size.width;
    CGFloat height = target_img.size.height;
    
    float verticalRadio = size.height*1.0/height;
    float horizontalRadio = size.width*1.0/width;
    
    float radio = 1;
    if(verticalRadio>1 && horizontalRadio>1)
    {
        radio = verticalRadio > horizontalRadio ? horizontalRadio : verticalRadio;
    }
    else
    {
        radio = verticalRadio < horizontalRadio ? verticalRadio : horizontalRadio;
    }
    
    width = width*radio;
    height = height*radio;
    
    int xPos = (size.width - width)/2;
    int yPos = (size.height-height)/2;
    
    // 创建一个bitmap的context
    // 并把它设置成为当前正在使用的context
    UIGraphicsBeginImageContext(size);
    
    // 绘制改变大小的图片
    [target_img drawInRect:CGRectMake(xPos, yPos, width, height)];
    
    // 从当前context中创建一个改变大小后的图片
    UIImage* scaledImage = UIGraphicsGetImageFromCurrentImageContext();
    
    // 使当前的context出堆栈
    UIGraphicsEndImageContext();
    
    // 返回新的改变大小后的图片
    return scaledImage;
}

+ (BOOL)onWXShareLink:(NSString*)shareSceneType title:(NSString*)title description:(NSString*)description iconUrl:(NSString*)iconUrl linkUrl:(NSString*)linkUrl
{
    WXWebpageObject *webpageObject = [WXWebpageObject object];
    webpageObject.webpageUrl = linkUrl;
    WXMediaMessage *message = [WXMediaMessage message];
    message.title = title;
    message.description = description;

    NSData *data = [NSData  dataWithContentsOfURL:[NSURL URLWithString:iconUrl]];
    UIImage *image =  [UIImage imageWithData:data];
    [message setThumbImage:image];
    message.mediaObject = webpageObject;
    SendMessageToWXReq *req = [[SendMessageToWXReq alloc] init];
    req.bText = NO;
    req.message = message;
    req.scene = [self getWxShareScene:shareSceneType];

    [WXApi sendReq:req completion:^(BOOL success) { NSLog(@"onWXShareLink:%@", success ? @"成功" : @"失败");  }];
    return  true;
}

+ (void)copyStrToClipboard: (NSString*)description
{
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    pasteboard.string = description;
}

+ (NSString*)getClipboardStr
{
    UIPasteboard *pasteboard = [UIPasteboard generalPasteboard];
    NSLog(@"%@", pasteboard.string);
    if (pasteboard.string !=NULL)
    {
        return pasteboard.string;
    }
    return @"";
}

- (void)applicationWillResignActive:(UIApplication *)application {
    /*
      Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
      Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
    */
    // We don't need to call this method any more. It will interrupt user defined game pause&resume logic
    /* cocos2d::Director::getInstance()->pause(); */
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    /*
      Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
    */
    // We don't need to call this method any more. It will interrupt user defined game pause&resume logic
    /* cocos2d::Director::getInstance()->resume(); */
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    /*
      Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
      If your application supports background execution, called instead of applicationWillTerminate: when the user quits.
    */
    cocos2d::Application::getInstance()->applicationDidEnterBackground();
    if (CAAgent.isInited) {
        [CAAgent onPause];
    }
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    /*
      Called as part of  transition from the background to the inactive state: here you can undo many of the changes made on entering the background.
    */
    cocos2d::Application::getInstance()->applicationWillEnterForeground();

    if (CAAgent.isInited) {
        [CAAgent onResume];
    }
}

- (void)applicationWillTerminate:(UIApplication *)application {
    /*
      Called when the application is about to terminate.
      See also applicationDidEnterBackground:.
    */
    if (s_sharedApplication != nullptr)
    {
        delete s_sharedApplication;
        s_sharedApplication = nullptr;
    }
    [CAAgent onDestroy];
}


#pragma mark -
#pragma mark Memory management

- (void)applicationDidReceiveMemoryWarning:(UIApplication *)application {
    /*
      Free up as much memory as possible by purging cached data objects that can be recreated (or reloaded from disk) later.
    */
}


#if __has_feature(objc_arc)
#else
- (void)dealloc {
    [window release];
    [_viewController release];
    [super dealloc];
}
#endif


@end

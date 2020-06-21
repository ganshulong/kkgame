/*
使用方法：
var ShaderUtils = require("ShaderUtils");
ShaderUtils.setShader(this.spGray, "gray");
*/

var ShaderUtils = {
    shaderPrograms: {},
    setShader: function(sprite, shaderName) {
        var glProgram = this.shaderPrograms[shaderName];
        if (!glProgram) {
            glProgram = new cc.GLProgram();
            //这边是对文件的引用
            var vert = require(cc.js.formatStr("%s.vert", shaderName));
            //对文件的引用
            var frag = require(cc.js.formatStr("%s.frag", shaderName));
            if (cc.sys.isNative) {  
                glProgram.initWithString(vert, frag);
            } else {  
                 glProgram.initWithVertexShaderByteArray(vert, frag);
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_POSITION, cc.macro.VERTEX_ATTRIB_POSITION);  
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_COLOR, cc.macro.VERTEX_ATTRIB_COLOR);  
                glProgram.addAttribute(cc.macro.ATTRIBUTE_NAME_TEX_COORD, cc.macro.VERTEX_ATTRIB_TEX_COORDS);  
            }
            glProgram.link();  
            glProgram.updateUniforms();
            this.shaderPrograms[shaderName] = glProgram;
        }
        sprite._sgNode.setShaderProgram(glProgram);
    },

    removeShader: function(sprite){
        sprite._sgNode.setState(0)
    }
};
module.exports = ShaderUtils;
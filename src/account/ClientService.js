import React, {Component} from 'react';
import Title from './../Title';

// const wechat_gzh = require("../img/wechatgzh.jpg");
const wechat = require("../img/icon_weixin.png");
class ClientService extends Component{
    render (){
        const sundryData = JSON.parse(localStorage.getItem("sundryData"));
        const wx_pic = sundryData.wx_pic;
        const wx_kefu = sundryData.wx_kefu;
        return <div>
            <Title title="客服中心"/>
            <div className="clientService fz_24">
                <p>
                    <img className="wechat" src={wechat} alt=""></img>
                    <span className = "fc_white">E币微信官方客服：</span>
                </p>
                <img className="weChatgzh" src={window.baseUrl + wx_pic} alt=""/>
                <p>
                    <span className="icon kefu"></span>
                    <span className = "fc_white">官方微信客服</span>
                </p>
                <div dangerouslySetInnerHTML = {{__html: wx_kefu}} style = {{color: "white"}}></div>
            </div>
        </div>
    }
}

export default ClientService;
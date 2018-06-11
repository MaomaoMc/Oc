import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';
import Tab from '../Tab';
import WarningDlg from './../WarningDlg';

const baseUrl = window.baseUrl;
const head_pic = require("../img/head_pic.png")
class PersonalData extends Component {
    constructor (props){
        super(props);
        const sundryData = localStorage.getItem("sundryData");
        const token = localStorage.getItem("token");
        this.state = {
            profile_pic: (baseUrl + JSON.parse(sundryData).adminpic) || head_pic, //头像
            head_pic: "",
            sundryData: sundryData,
            token: token,
            data: {},  //个人数据
            warningDlgShow: false,
            warningText: "",
            code: ""
        }
    }
    hanleWarningDlgTimer (){  //定时关闭 警告弹窗
        const self = this;
        setTimeout(
            function(){
                self.setState({
                    warningDlgShow: false
                })
            }
        , 1000)
    }
    setPhotoEvent (){
        const self = this;
        axios.post(window.baseUrl +  "/home/Member/editphoto?token=" + self.state.token, qs.stringify({
            pic: self.state.profile_pic
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            if(code === 1){
                let sundryData = JSON.parse(localStorage.getItem("sundryData"));
                sundryData.adminpic = self.state.head_pic;
                localStorage.setItem("sundryData", JSON.stringify(sundryData));
            }
            self.setState({
                warningDlgShow: true,
                warningText: data.msg,
                code: code
            }, function(){
                self.hanleWarningDlgTimer();
            })
        });
    }
    uploadedFile (e){ //修改头像
        const self = this;
        let file = document.getElementById("photo").files[0];
        let formData = new FormData()  // 创建form对象
        formData.append('pic', file)  // 通过append向form对象添加数据
        axios.post(baseUrl +  "/home/Base/uploadPic?token=" + self.state.token, formData, {
            transformRequest: [(data) => data],
            headers: {}
        }).then(function(res){
            const data = res.data;
            const code = data.code;
            if(code === 1){ //成功
                self.setState({
                    profile_pic: baseUrl +  data.data,
                    head_pic: data.data  //因为sundryData  里面的adminPic 没有baseUrl 喂呀
                }, function(){  //保存图片
                    self.setPhotoEvent()
                })
            } else {
                self.setState({
                    warningDlgShow: true,
                    warningText: data.msg
                }, function(){
                    self.hanleWarningDlgTimer();
                })
             }
            self.setState({
                code: code
            })
        })
    }
    ajax (){ //个人资料数据
        const self = this;
        axios.post(baseUrl +  "/home/Member/personalData", qs.stringify({
            token: self.state.token
        })).then(function(res){
            const data = res.data;
            const code = data.code;
            if(code === 1){ //成功
                self.setState({
                    data: data.data,
                    profile_pic: data.data.pic
                })
            } else {
                self.setState({
                    warningDlgShow: true,
                    warningText: data.msg
                }, function(){
                    self.hanleWarningDlgTimer();
                })
             }
            self.setState({
                code: code
            })
        })
    }
    componentDidMount (){
        this.ajax();
    }
    render (){
        const data = this.state.data;
        const profile_pic = this.state.profile_pic;
        const head_pic = profile_pic === "" ? (baseUrl + JSON.parse(this.state.sundryData).adminpic) : profile_pic;
        console.log(head_pic, 'sda')
        return <div className="personalData">
            <Title title="个人资料" code = {this.state.code}/>
            <div className="personData">
                <div style = {{paddingTop: ".1rem", marginBottom: ".1rem"}}>
                    <div className="boxF">
                        <div className="boxS">
                            <form action="" id="form" class = "boxT" style={{backgroundImage: "url(" + head_pic + ")"}}> 
                                <input type="file" name="photo" id="photo" 
                                    onChange = {e => {this.uploadedFile({value: e.target.value, obj: e.target})}}
                                    />
                                    {/* <img src={profile_pic === "" ? (baseUrl + JSON.parse(this.state.sundryData).adminpic) : profile_pic} alt=""/> */}
                            </form>
                            {/* <div className="boxT" style={{backgroundImage: "url(" + head_pic + ")"}}>
                                <div className="overlay">
                                    <a href="#">+</a>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
                {/* <div className="file" style = {{backgroundImage: "url(" + head_pic + ")"}}>
                    <form action="" id="form"> 
                        <input type="file" name="photo" id="photo" 
                            onChange = {e => {this.uploadedFile({value: e.target.value, obj: e.target})}}
                            /> */}
                            {/* <img src={profile_pic === "" ? (baseUrl + JSON.parse(this.state.sundryData).adminpic) : profile_pic} alt=""/> */}
                    {/* </form>
                </div>  */}
                <ul className="fz_30 f_flex overview">
                    <li>
                        <p className="fc_y">上级ID</p>
                        <p className = "fc_white">{data.tui_num}</p>
                    </li>
                    <li>
                        <p className="fc_y">我的ID</p>
                        <p className = "fc_white">{data.id_num}</p>
                    </li>
                    <li>
                        <p className="fc_y">等级</p>
                        <p className = "fc_white">{data.level_msg}</p>
                    </li>
                </ul>
            </div>
            <ul className="lists f_flex fz_26 mb_100">
                <li>
                    <span className="f_lt fc_white">手机号验证</span>
                    <span className="f_rt">
                        <span className="fc_blue">{data.phone}</span>
                        {data.phone !== "" ?
                            <span className="mark authenticated">已认证</span> :
                            <span className="mark unauthorized">已认证</span>
                        }
                        
                    </span>
                </li>
                <li>
                    {data.bank_num === "" ? <Link to = "/account/creditCertify/unauthorized">
                        <span className="f_lt fc_white">银行卡</span>
                        <span className="f_rt">
                            <span className="fc_blue">{data.bank_num}</span>
                            <span className="mark unauthorized">未认证</span>
                        </span>
                    </Link> :  <Link to = "/account/creditCertify/authorized"><span><span className="f_lt fc_white">银行卡</span>
                            <span className="f_rt">
                                <span className="fc_blue">{data.bank_num}</span>
                                <span className="mark authenticated">已认证</span> 
                            </span>
                        </span></Link>
                    }
                </li>
                <li>
                    {data.username === "" ? <Link to = "/account/certify/unauthorized">
                        <span className="f_lt fc_white">实名认证</span>
                        <span className="f_rt">
                            <span className="fc_blue">{data.username}</span>
                            <span className="mark unauthorized">未认证</span>
                        </span>
                    </Link> :  <Link to = "/account/certify/authorized"><span><span className="f_lt fc_white">实名认证</span>
                            <span className="f_rt">
                                <span className="fc_blue">{data.username}</span>
                                <span className="mark authenticated">已认证</span> 
                            </span>
                        </span></Link>
                    }
                </li>
                <li>
                    <Link to = "/account/shuaCertify/" >
                        <span className="f_lt">刷脸认证</span>
                        <span className="f_rt">
                            <span className="mark unauthorized">未认证</span>
                        </span>
                    </Link>
                </li>
                <li style={{height: ".21rem"}}></li>
                <li>
                    {data.wx_num !== "" ? <Link to="/account/weChatBind">
                        <span className="f_lt">微信</span>
                        <span className="f_rt">
                            <span className="mark unauthorized">未认证</span>
                        </span>
                    </Link> : <a>
                        <span className="f_lt">微信</span>
                        <span className="f_rt">
                            <span className="fc_blue">{data.wx_num}</span>
                            <span className="mark authenticated">已认证</span> 
                        </span>
                    </a>}
                </li>
                <li>
                    {data.zfb_num === "" ? <Link to="/account/aliPayBind">
                        <span className="f_lt">支付宝</span>
                        <span className="f_rt">
                            <span className="mark unauthorized">未认证</span>
                        </span>
                    </Link> :
                     <a>
                        <span className="f_lt">支付宝</span>
                        <span className="f_rt">
                            <span className="fc_blue">{data.zfb_num}</span>
                            <span className="mark authenticated">已认证</span> 
                        </span>
                    </a>}
                </li>
                <li>
                    <Link to="/account/changeLoginPwd">
                        <span className="f_lt">修改登录密码</span>
                        <span className="f_rt">
                        <span className="go_arrow"></span>
                        </span>
                    </Link>
                </li>
                <li>
                    <Link to="/account/changeTradePwd"> 
                        <span className="f_lt">修改交易密码</span>
                        <span className="f_rt">
                        <span className="go_arrow"></span> 
                        </span>
                    </Link>
                </li>
                <li>
                    <Link to = "/account/invite">
                        <span className="f_lt">我的推广</span>
                        <span className="f_rt">
                            <span className="go_arrow"></span> 
                        </span>
                    </Link>
                </li>
            </ul>
            {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
           <Tab />
        </div>
    }
}

export default PersonalData;
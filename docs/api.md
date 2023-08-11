# 慕课乐高后端借口设计

## 权限设计

|用户类别|操作权限|
|-|-|
|登陆用户|只能管理自己的资源|
|管理员|所有资源,...|

## RESTFul API

用户体系
支持 密码登陆, 手机号登陆, Oauth2(github)

## 密码登录
* 创建用户: POST /users/create
* 用户登录: POST /users/loginByEmail

## 手机号登录
* 获取手机验证码: POST /users/genVeriCode
* 手机验证码登录: POST /users/loginByPhoneNumber

## Oauth 登录
* 跳转至授权页面: GET /users/passport/github
* 跳转回来带着 access_token 参数 GET /users/passport/github/callback?access_token=***

用户获取,更新, 删除
* 获取信息: GET /users/getUserInfo
* 更新信息 PATCH /users/updateUserInfo
* 删除用户 DELETE /users/users/:id

## 作品和公共模块

### 作品
* 创建作品: POST /works/create/
* 复制作品: POST /works/copy/:id
* 获取作品列表: get /works?title=***&pageIndex=0&pageSize=4
* 获取单个作品: GET /works/:id
* 修改作品: PATCH /works/:id
* 删除作品: DELETE /works/:id
  

### 发布作品
* 发布作品: POST /works/publish/:id
* 发布为模版: POSt /works/publish-template/:id

```
// 返回格式
{
  url: 'http://localhost:7001/api/pages/:idAndUuid'
}
```

### 公共模版
* 获取公共模版列表：GET /templates?title=***&pageIndex=0&pageSize=4
* 获得单个作品 GET /templates/:id


### 渠道
渠道是作品的子属性，一个作品可以有多个渠道

* 创建渠道： POST channel/
* 获取一个作品的所有渠道：GET channel/getWorkChannels/2
* 更新渠道名称：PATCH channel/updateName/2
* 删除渠道：DELETE channel/2


## 工具类
其他一些与实体无关的接口

### 上传图片
POST /utils/upload-img

### 展示 H5 页面

使用 lego-components 使用 ssr 在 h5 端进行展示，这个接口不是标准 RESTful API， 用来展示页面，并且做样式转换和处理

* GET /api/pages/:idAndUuid  => nginx 改写至 h5.imooc-lego.com/p/:idAndUuid 
* GET /api/pages/preview/:idAndUuid 改写至 h5.imooc-lego.com/p/preview/:idAndUuid 
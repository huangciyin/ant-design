import React from 'react';
import ReactDOM from 'react-dom';
import Dialog from './index';
import Icon from '../icon';
import Button from '../button';

export default function (props) {
  let div = document.createElement('div');
  document.body.appendChild(div);

  let d;
  props = props || {};
  props.iconClassName = props.iconClassName || 'question-circle';
  let iconClassType = props.iconClassName;

  let width = props.width || 416;

  // 默认为 true，保持向下兼容
  if (!('okCancel' in props)) {
    props.okCancel = true;
  }

  function close() {
    d.setState({
      visible: false
    });
    ReactDOM.unmountComponentAtNode(div);
  }

  function onCancel() {
    let cancelFn = props.onCancel;
    if (cancelFn) {
      let ret;
      if (cancelFn.length) {
        ret = cancelFn(close);
      } else {
        ret = cancelFn();
        if (!ret) {
          close();
        }
      }
      if (ret && ret.then) {
        ret.then(close);
      }
    } else {
      close();
    }
  }

  function onOk() {
    let okFn = props.onOk;
    if (okFn) {
      let ret;
      if (okFn.length) {
        ret = okFn(close);
      } else {
        ret = okFn();
        if (!ret) {
          close();
        }
      }
      if (ret && ret.then) {
        ret.then(close);
      }
    } else {
      close();
    }
  }

  let body = <div className="ant-confirm-body">
    <Icon type={iconClassType} />
    <span className="ant-confirm-title">{props.title}</span>
    <div className="ant-confirm-content">{props.content}</div>
  </div>;
  let footer = <div className="ant-confirm-btns">
    <Button type="ghost" size="large" onClick={onCancel}>取 消</Button>
    <Button type="primary" size="large" onClick={onOk}>确 定</Button>
  </div>;

  if (props.okCancel) {
    footer = <div className="ant-confirm-btns">
      <Button type="ghost" size="large" onClick={onCancel}>取 消</Button>
      <Button type="primary" size="large" onClick={onOk}>确 定</Button>
    </div>;
  } else {
    footer = <div className="ant-confirm-btns">
      <Button type="primary" size="large" onClick={onOk}>知道了</Button>
    </div>;
  }

  ReactDOM.render(<Dialog
    prefixCls="ant-modal"
    className="ant-confirm"
    visible={true}
    closable={false}
    title=""
    transitionName="zoom"
    footer=""
    maskTransitionName="fade" width={width}>
    <div style={{zoom: 1, overflow: 'hidden'}}>{body} {footer}</div>
  </Dialog>, div, function () {
    d = this;
  });
}

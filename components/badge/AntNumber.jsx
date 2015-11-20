import React, { createElement } from 'react';
import { findDOMNode } from 'react-dom';
import { toArrayChildren, getPartNumber, getTranslateY } from './utils';
import assign from 'object-assign';

class AntNumber extends React.Component {
  constructor(props) {
    super(props);
    const children = toArrayChildren(this.props.children);
    this.endSetState = false;
    this.count = this.props.count;
    this.data = getPartNumber(this.count);
    this.timeout = null;
    this.state = {
      children,
    };
  }

  getNumberOnly(index, style) {
    const childrenToReturn = [];
    for (let i = 0; i < 30; i++) {
      let count = i >= 10 ? i % 10 : i;
      childrenToReturn.push(<p key={i}>{count}</p>);
    }
    return createElement('span', {
      className: `${this.props.prefixCls}-only`,
      style: style,
      key: index,
    }, childrenToReturn);
  }

  setEndState(style) {
    this.endSetState = true;
    style.transition = 'none';
  }

  getNumberElement(props) {
    const count = props.count;
    if (!count || count === '') {
      return null;
    }
    const length = count.toString().length;
    const data = getPartNumber(count);
    const height = findDOMNode(this).offsetHeight;
    let childrenWap = [];
    let i = 0;
    while (i < length) {
      const oneData = Number(count.toString()[i]);
      const style = {};
      let translateY = -(oneData + 10) * height;
      //判断状态
      translateY = getTranslateY(count, this.count, data, this.data, i, height, length - 1) || translateY;
      if (count !== this.count) {
        this.setEndState(style);
      }
      style.transform = `translateY(${translateY}px)`;
      const children = this.getNumberOnly(i, style);
      childrenWap.push(children);
      i++;
    }
    this.data = data;
    this.count = count;
    return childrenWap;
  }

  updateChildren(props) {
    if (typeof props.count === 'string') {
      this.data = getPartNumber(this.props.max);
      this.count = this.props.max;
      return this.setState({
        children: [props.count],
      });
    }
    const newChildren = this.getNumberElement(props);
    if (newChildren && newChildren.length) {
      this.setState({
        children: newChildren,
      }, ()=> {
        if (this.endSetState) {
          this.updateChildren(props);
          this.endSetState = false;
        }
      });
    }
  }

  animEnd() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(()=> {
      if (typeof this.props.callback === 'function') {
        this.props.callback();
      }
    }, 300);
  }

  componentDidMount() {
    this.updateChildren(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.updateChildren(nextProps);
    this.animEnd();
  }

  render() {
    const childrenToRender = this.state.children;
    const props = assign({}, this.props, {className: `${this.props.prefixCls} ${this.props.className}`});
    return createElement(this.props.component, props, childrenToRender);
  }
}

AntNumber.defaultProps = {
  prefixCls: 'ant-number',
  count: null,
  max: 99,
  component: 'sup',
  callback: null,
};

AntNumber.propTypes = {
  count: React.PropTypes.oneOfType([
    React.PropTypes.string,
    React.PropTypes.number
  ]),
  component: React.PropTypes.string,
  callback: React.PropTypes.func,
  max: React.PropTypes.number,
};

export default AntNumber;
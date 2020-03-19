import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import { connect } from '@tarojs/redux'

import { add, clear } from '../../actions/counter'

import './index.scss'

@connect(({ counter }) => ({
  counter
}), (dispatch) => ({
  add() {
    dispatch(add())
  },
  clear() {
    dispatch(clear())
  }
}))
class Index extends Component {
  constructor(props){
    super(props)
    this.state = {
      flag: 'initial',     //状态 initial-初始    ongoing-进行中    pause-暂停
      tagList: []
    }
    this.timer = undefined
  }

  config = {
    navigationBarTitleText: '秒表'
  }

  tagging = () => {
    this.state.tagList.unshift(this.props.counter.num)
    this.setState({tagList: this.state.tagList})
  }

  //秒数转00:00:00时间格式
  secondsToTime = (s) => {
    if( s < 60 ){
      return `00:00:${this.addZero(s)}`
    }else if( s < 60*60 ){
      let minutes = parseInt( s/60 )
      let seconds = s % 60
      return `00:${this.addZero(minutes)}:${this.addZero(seconds)}`
    }else{
      let hours = parseInt( s/(60*60) )
      let minutes = parseInt( ( s - ( hours*60*60 ) ) / 60 )
      let seconds = s - ( hours*60*60 ) - ( minutes* 60 )
      return `${this.addZero(hours)}:${this.addZero(minutes)}:${this.addZero(seconds)}`
    }
  }

  //加零
  addZero = (num) => {
    return num > 9 ? num : '0'+num;
  }

  action = () => {
    if( this.timer ){
      return
    }
    this.setState({flag: 'ongoing'})  //更改状态为进行中
    this.timer = setInterval(()=>{
      this.props.add()
    },1000)
  }

  stop = () => {
    this.setState({flag: 'pause'})
    clearInterval(this.timer)
    this.timer = undefined
  }
  
  over = () => {
    this.setState({flag: 'initial'})
    this.props.clear()
    this.setState({tagList:[]})
  }

  render() {
    let { tagList } = this.state

    return (
      <View className='index'>
        <View><Text>{this.secondsToTime(this.props.counter.num)}</Text></View>
        ----------------------------------
        {
          tagList.map((item) => <View><Text>{this.secondsToTime(item)}</Text></View> ) 
        }
        {
          {
            'initial':
              <div>
                <Button className='add_btn' onClick={this.action}>开始</Button>
              </div>,
            'ongoing':
            <div>
                <Button className='add_btn' onClick={this.tagging}>标记</Button>
                <Button className='add_btn' onClick={this.stop}>暂停</Button> 
              </div>,
            'pause':
            <div>
              <Button className='add_btn' onClick={this.action}>恢复</Button> 
              <Button className='add_btn' onClick={this.over}>结束</Button> 
            </div>
          }[this.state.flag]
        }
      </View>
    )
  }
}

export default Index

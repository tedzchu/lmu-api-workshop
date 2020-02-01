import React, { Component } from 'react';
import moment from 'moment';
import './InfoBox.css';

class InfoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPrice: null,
      monthChangeD: null,
      monthChangeP: null,
      updatedAt: null
    };
  }
  componentDidMount() {
    this.getData = () => {
      const { data } = this.props;
      const url =
        'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TSLA&apikey=[YOUR_KEY_HERE]';

      fetch(url)
        .then(r => r.json())
        .then(stockData => {
          const price =
            stockData['Time Series (Daily)'][
              Object.keys(stockData['Time Series (Daily)'])[0]
            ]['4. close'];
          const change = price - data[0].y;
          const changeP = ((price - data[0].y) / data[0].y) * 100;
          this.setState({
            currentPrice: Number(price).toLocaleString('us-EN', {
              style: 'currency',
              currency: 'USD'
            }),
            monthChangeD: change.toLocaleString('us-EN', {
              style: 'currency',
              currency: 'USD'
            }),
            monthChangeP: changeP.toFixed(2) + '%',
            updatedAt: new moment()
          });
        })
        .catch(e => {
          console.log(e);
        });
    };
    this.getData();
    this.refresh = setInterval(() => this.getData(), 90000);
  }
  componentWillUnmount() {
    clearInterval(this.refresh);
  }
  render() {
    return (
      <div id='data-container'>
        {this.state.currentPrice ? (
          <div id='left' className='box'>
            <div className='heading'>
              {this.state.currentPrice.toLocaleString('us-EN', {
                style: 'currency',
                currency: 'USD'
              })}
            </div>
            <div className='subtext'>
              {'Updated ' + moment(this.state.updatedAt).fromNow()}
            </div>
          </div>
        ) : null}
        {this.state.currentPrice ? (
          <div id='middle' className='box'>
            <div className='heading'>{this.state.monthChangeD}</div>
            <div className='subtext'>Change Since Last Month (USD)</div>
          </div>
        ) : null}
        <div id='right' className='box'>
          <div className='heading'>{this.state.monthChangeP}</div>
          <div className='subtext'>Change Since Last Month (%)</div>
        </div>
      </div>
    );
  }
}

export default InfoBox;

import React, { Component } from 'react';
import moment from 'moment';
import './App.css';
import LineChart from './LineChart';
import ToolTip from './ToolTip';
import InfoBox from './InfoBox';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      data: null,
      hoverLoc: null,
      activePoint: null
    };
  }
  handleChartHover(hoverLoc, activePoint) {
    this.setState({
      hoverLoc: hoverLoc,
      activePoint: activePoint
    });
  }
  componentDidMount() {
    const getData = () => {
      const url =
        'https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=TSLA&apikey=[YOUR_KEY_HERE]';

      fetch(url)
        .then(r => r.json())
        .then(stockData => {
          const sortedData = [];
          let count = 29;
          for (let date in stockData['Time Series (Daily)']) {
            sortedData.unshift({
              d: moment(date).format('MMM DD'),
              p: stockData['Time Series (Daily)'][date][
                '4. close'
              ].toLocaleString('us-EN', { style: 'currency', currency: 'USD' }),
              x: count, //previous days
              y: stockData['Time Series (Daily)'][date]['4. close'] // numerical price
            });
            count -= 1;
            if (count < 0) {
              break;
            }
          }
          this.setState({
            data: sortedData,
            fetchingData: false
          });
        })
        .catch(e => {
          console.log(e);
        });
    };
    getData();
  }
  render() {
    return (
      <div className='container'>
        <div className='row'>
          <h1>30 (Trading) Day TSLA Price Chart</h1>
        </div>
        <div className='row'>
          {!this.state.fetchingData ? <InfoBox data={this.state.data} /> : null}
        </div>
        <div className='row'>
          <div className='popup'>
            {this.state.hoverLoc ? (
              <ToolTip
                hoverLoc={this.state.hoverLoc}
                activePoint={this.state.activePoint}
              />
            ) : null}
          </div>
        </div>
        <div className='row'>
          <div className='chart'>
            {!this.state.fetchingData ? (
              <LineChart
                data={this.state.data}
                onChartHover={(a, b) => this.handleChartHover(a, b)}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default App;

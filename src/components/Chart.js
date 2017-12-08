import React, { Component } from "react"
import { connect } from "react-redux"
import Chart from "chart.js"
import { toggle_modal, plot_Chart } from "../store/actions"

const options = (ticks, title, datasets, labels) => {
  return {
    responsive: false,
    maintainAspectRatio: false,
    type: "line",
    data: {
      labels: labels,
      datasets: datasets
    },
    title: {
      display: true,
      text: title
    },
    options: {
      legend: {
        display: false
      },
      layout: { 
        padding: {
          top: 10,
          bottom: 10
        }
      },
      scales: {
        yAxes: [{
          gridLines: {
            display:false
          },
          afterBuildTicks: (thisChart) => {
            thisChart.ticks = []
            thisChart.ticks.push(ticks.ucl)
            thisChart.ticks.push(ticks.center)
            thisChart.ticks.push(ticks.lcl)
          }
        }],
        xAxes: [{
          gridLines: {
            display:false
          }
        }]
      },
      animation: {
        duration: 0,
      },
      hover: {
        animationDuration: 0,
      },
        responsiveAnimationDuration: 0,
    },
  }
}

class ChartComponent extends Component {

  componentDidMount() {
    this.render_chart()
  }

  componentWillUnmount() {
    this.chart_instance.destroy()
  }

  componentDidUpdate() {
    this.chart_instance.destroy()
    this.render_chart()
  }

  shouldComponentUpdate(nextProps) {
    const { labels, datasets} = this.props.plot
    
    if (labels !== nextProps.plot.labels || datasets !== nextProps.plot.datasets) {
      return true
    }
    return false
  }

  render_chart() {
    const node = this.element
    const { labels, datasets, title, ticks } = this.props.plot
    
    this.chart_instance = new Chart(node, {
      ...options(ticks, title, datasets, labels)
    })
  }

  downloadChart = (event) => {
    this.download.href = this.element.toDataURL()
    this.download.download = "ControlCharts.png"
  }

  render(){

    const { displayInfo, title, ticks } = this.props.plot
    const { toggleModal, plotChart} = this.props

    return (
      <div className="chart" ref={parent => this.parent = parent}>
        <div className="controls">

          <a className="button  marginRight" onClick={toggleModal}>Import Data</a>

          <div className="comboBox  marginRight">
            <select onChange={plotChart}>
              <option>Charts</option>
              <option>Xbar_Rbar</option>
              <option>Xbar_Sbar</option>
              <option>Rbar</option>
              <option>Sbar</option>
              <option>Ewma</option>
              <option>Cusum</option>
            </select>
          </div>

          {
            displayInfo &&
            <a ref={element => this.download = element}
            className="button fadeToRight" onClick={this.downloadChart}>Download</a>
          }

        </div>

        <canvas ref={element => this.element = element} />

        {
          displayInfo ?
          <div className="information">
            
            <div>
              <h1>{title}</h1>
              <div><b>Lower Control Limit: </b> {ticks.ucl.toFixed(4)}</div>
              <div><b>Center: </b> {ticks.center.toFixed(4)}</div>
              <div><b>Upper Control Limit: </b> {ticks.lcl.toFixed(4)}</div>
            </div>

            <div>

            </div>

          </div> :

          <div className="description">
            <h2>What is this!?</h2>
            <p>The control chart is one of the seven basic tools of quality control. Typically control charts are used for time-series data, though they can be used for data that have logical comparability (i.e. you want to compare samples that were taken all at the same time, or the performance of different individuals); however the type of chart used to do this requires consideration.<a href="https://en.wikipedia.org/wiki/Control_chart">- Wikipedia</a></p>
          </div>          
        }
              
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    plot: state.plot
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleModal: () => dispatch(toggle_modal()),
    plotChart: (e) => dispatch(plot_Chart(e))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChartComponent);
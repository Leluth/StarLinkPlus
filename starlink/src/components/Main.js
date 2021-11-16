import React, {Component} from 'react';
import {Col, Row} from 'antd';
import SatSetting from "./SatSetting";
import SatelliteList from "./SatelliteList";
import {NEARBY_SATELLITE, SAT_API_KEY, STARLINK_CATEGORY} from "../constants";
import axios from "axios";
import WorldMap from "./WorldMap";

class Main extends Component {
    constructor(props){
        super(props);
        this.state = {
            satInfo: null,
            settings: null,
            satList: null,
            isLoadingList: false
        };
    }

    showNearbySatellite = (setting) => {
        this.setState({
            isLoadingList: true,
            settings: setting
        })
        this.fetchSatellite(setting);
    }

    fetchSatellite= (setting) => {
        const {latitude, longitude, elevation, altitude} = setting;
        const url = `/api/${NEARBY_SATELLITE}/${latitude}/${longitude}/${elevation}/${altitude}/${STARLINK_CATEGORY}
        /&apiKey=${SAT_API_KEY}`;

        this.setState({
            isLoadingList: true
        });

        axios.get(url)
            .then(response => {
                this.setState({
                    satInfo: response.data,
                    isLoadingList: false
                })
            })
            .catch(error => {
                console.log('err in fetch satellite -> ', error);
                this.setState({
                    isLoadingList: false
                })
            })
    }

    showMap = (selected) => {
        this.setState(preState => ({
            ...preState,
            satList: [...selected]
        }))
    }

    render() {
        const {satInfo, settings, satList, isLoadingList} = this.state;
        return (
            <Row className='main'>
                <Col span={8} className='left-side'>
                    <SatSetting onShow={this.showNearbySatellite}/>
                    <SatelliteList satInfo={satInfo}
                                   isLoad={isLoadingList}
                                   onShowMap={this.showMap}
                    />
                </Col>
                <Col span={16} className="right-side">
                    <WorldMap satData={satList} observerData={settings} />
                </Col>
            </Row>
        );
    }
}

export default Main;
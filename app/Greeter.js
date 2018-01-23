// Greeter.js
import React, {Component} from 'react'
import config from './config.json';
import styles from './Greeter.css';//导入

class Greeter extends Component{
    render() {
        return (
            <div className={styles.root}>
                <h2>{config.contentText}</h2>
                <p>{config.greetText}</p>
            </div>
        );
    }
}

export default Greeter

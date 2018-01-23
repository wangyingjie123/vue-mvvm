//main.js
import React from 'react';
import {render} from 'react-dom';
import Greeter from './Greeter'; // react
import './main.css';//使用require导入css文件,全局

render(<Greeter />, document.getElementById('root'));
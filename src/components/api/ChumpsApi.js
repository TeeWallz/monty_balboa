import {Component} from "react";
import React from 'react';
import Chumps from "../../data/chumps";

function ChumpsApi(props)  {
    return JSON.stringify(Chumps())
}

export default ChumpsApi
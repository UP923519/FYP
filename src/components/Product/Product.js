import React, { Component } from 'react';
import './Product.css';
import { MapUpdate, getCurrentLocation } from './Location.js';
import { LocationCalc } from './locationCalculator2.js';
import { address } from './locationCalculator.js';
import { trO, trD, DistanceBetweenPoints } from './Location 2.js';

//import 'realtime-trains-scraper';
import { InputLocation } from './InputLocation';
import { InputLocationCar } from './InputLocationCar';
import { GetMiles } from './GetMiles';

//const realtimeTrains = require('realtime-trains-scraper');


const products = [
    {
      emoji: 'Option 1',
      name: 'Route 1',
      price: 500
    },
    {
      emoji: 'Option 2',
      name: 'Route 2',
      price: 250,
    },
    {
      emoji: 'Option 3',
      name: 'Route 3',
      price: 630
    }
  ];
  

export default class Product extends Component {

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }

  state = {
    cart: []
  }

  add = (product) => {
    this.setState(state => ({
      cart: [...state.cart, product],
    }))
  }

  remove = (product) => {
    this.setState(state => {
      const cart = [...state.cart];
      const productIndex = cart.findIndex(p => p.name === product.name);
      if(productIndex < 0) {
        return;
      }
      cart.splice(productIndex, 1)
      return ({
        cart
      })
    })
  }

  currencyOptions = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }
  

  getTotal = () => {
    const total = this.state.cart.reduce((totalCost, item) => totalCost + item.price, 0);
    return total.toLocaleString(undefined, this.currencyOptions)
  }



  render() {
    return(
      <div>
        <h3>Journey Planner</h3>
        
        <div style={{ width: "100%", height: "500px" }}>
          <MapUpdate />
        </div>
        <p> <br></br></p>
        <LocationCalc/>
        <p>
          <InputLocation/>
          <GetMiles/>
        </p>
        <p>
        <InputLocationCar/>
        </p>

        <div>
        <br/><br/>
        {/*
        Select Journey: {this.state.cart.length} selected.
        </div>
        <div>Total emissions {this.getTotal()}</div>
        <div>
          {products.map(product => (
            <div key={product.name}>
              <div className="product">
                <span role="img" aria-label={product.name}>{product.emoji}</span>
              </div>
              <button onClick={() => this.add(product)}>Add</button>
              <button onClick={() => this.remove(product)}>Remove</button>
            </div>
          ))}
          */}
        </div>
      </div>
    )
  }
}


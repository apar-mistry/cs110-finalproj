// app/components/BokehBackground.js
"use client"
import React, { useEffect } from 'react';
import styles from './BokehBackground.module.css';

const BokehBackground = () => {
  useEffect(() => {
    const bokehContainer = document.getElementById('bokeh-container');
    for (let i = 0; i < 15; i++) { 
      const bokehBall = document.createElement('div');
      bokehBall.className = styles.bokehBall;
      bokehBall.style.left = `${Math.random() * 100}%`;
      bokehBall.style.top = `${Math.random() * 100}%`;
      bokehContainer.appendChild(bokehBall);
    }
  }, []);

  return <div id="bokeh-container" className={styles.bokehContainer}></div>;
};

export default BokehBackground;
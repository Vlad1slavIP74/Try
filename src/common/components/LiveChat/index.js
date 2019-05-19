import React, { Component } from 'react'
import scriptLoader from 'react-async-script-loader'
import styled from 'styled-components'

const scriptRender = (dark) => `
    <script>
        (function(d, w, c) {
            w.ChatraID = 'PYK5tLGHCgWZaXfSy';
            var s = d.createElement('script');
            w[c] = w[c] || function() {
                (w[c].q = w[c].q || []).push(arguments);
            };
            s.async = true;
            s.src = 'https://call.chatra.io/chatra.js';
            if (d.head) d.head.appendChild(s);
        })(document, window, 'Chatra');
    </script>
    <script>
    window.ChatraSetup = {
        buttonStyle: 'round',
        colors: {
            buttonBg: '#2b2b2b',
        },
        locale: 'ru'
    };
    </script>
    <style>
    #chatra:not(.chatra--expanded) {
      visibility: hidden !important;
      opacity: 0 !important;
      pointer-events: none;
    }
    </style>
    <style>
        .chat-container {
          cursor: pointer;
          position: fixed;
          bottom: 20;
          right: 20;
          z-index: 99;       
        }

        .chat-container a {
            pointer-events: none;
        }

        .chat-bg {
            cursor: pointer;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background-color: #2b2b2b;
            box-shadow: 0 2px 7px 0 rgba(10, 10, 10, 0.73), 0 1px 0px 0 rgba(0, 0, 0, 0.09);
            position: relative;
            padding: 13px;       
        }

        .chat-bg:hover {
            background: #7b7b7b;   
        }        

        .chat-bg.dark {;
            background-color: #000000 !important;    
        }

    </style>

    <div class='chat-container'>
        <a onclick="javascript:Chatra('openChat', true)" class='chat-btn'>
            <div class='chat-bg ${dark && 'dark'}'>
                <img src='/public/images/chat-icon.png'/>
            </div>
        </a>
    </div>
`

const LiveChat = ({ dark }) => {
	return <div dangerouslySetInnerHTML={{__html: scriptRender(dark) }} />
}

export default LiveChat

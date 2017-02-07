import React from 'react';
import {render} from 'react-dom';
import $ from 'jquery';
import nacl from 'tweetnacl';
import naclutil from 'tweetnacl-util';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Card from 'material-ui/Card';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';


import injectTapEventPlugin from 'react-tap-event-plugin';



class Application extends React.Component {
    state = {
        transactions: [],
        blocks: [],
    }

    handleHostChange = (e) => {
        this.setState({
            'hostName': e.target.data,
        })
    }

    handleConnect = () => {
    }

    componentDidMount() {
        console.log('hello ' + this.state.hostName)

        var transactions = []

        var hostName = window.location.hostname
        // var hostName = '7b702f9db475c6beb70fc755a86d3b1be962b4f3.stratumn.xyz'
        var s = new WebSocket('ws://' + hostName + ':46657/websocket')


        // Convert a hex string to a byte array
        function hexToBytes(hex) {
            for (var bytes = [], c = 0; c < hex.length; c += 2)
            bytes.push(parseInt(hex.substr(c, 2), 16));
            return bytes;
        }

        function bytesToString(array) {
          var result = "";
          for (var i = 0; i < array.length; i++) {
            result += String.fromCharCode(array[i]);
          }
          return result;
        }

        s.onmessage = function(event) {
            var obj = JSON.parse(event.data)
            var txs = obj.result[1].data[1].block.data.txs
            var blockHeight = obj.result[1].data[1].block.header.height
            var blockTs = obj.result[1].data[1].block.header.time
            // TODO: probably not last_block_hash ?
            var blockHash = obj.result[1].data[1].block.header.last_block_hash

            if (this.state.blocks.length > 5) {
                this.state.blocks.shift()
            }
            this.state.blocks.push([blockHeight, blockTs, blockHash, txs.length])
            this.setState({
                'blocks': this.state.blocks
            })

            for (var i = 0; i < txs.length; i++) {
              var tx = txs[i]
              var txobj = JSON.parse(bytesToString(hexToBytes(tx)))
              var sender = txobj.Owner.substring(2)
              var dataobj = JSON.parse(bytesToString(hexToBytes(txobj.Data)))
              var action = dataobj.Action
              var arg1, arg2, arg3

              if (dataobj.Args.length > 0) {
                arg1 = dataobj.Args[0]
              }
              if (dataobj.Args.length > 1) {
                arg2 = dataobj.Args[1]
              }
              if (dataobj.Args.length > 2) {
                arg3 = dataobj.Args[2]
              }

              var txid = blockHeight.toString() + "/" + i.toString()
              if (this.state.transactions.length > 5) {
                  this.state.transactions.shift()
              }
              this.state.transactions.push([txid, blockHeight, sender, action, arg1, arg2, arg3])
              this.setState({
                'transactions': this.state.transactions
              })
            }
        }.bind(this)

        s.onopen = function(event) {
            s.send('{"jsonrpc": "2.0", "method": "subscribe", "params": ["NewBlock"]}')
        }

    }

    render() {


        var rowsBlocks = []
        for (var i = 0; i < this.state.blocks.length; i++) {
            var block = this.state.blocks[i]
            rowsBlocks.push(
                <TableRow key={block[0]}>
                  <TableRowColumn style={{width: '100px'}}>{block[0]}</TableRowColumn>
                  <TableRowColumn style={{width: '240px'}}>{block[1]}</TableRowColumn>
                  <TableRowColumn style={{width: '400px', fontFamily: 'Roboto Mono, Monospace'}}>{block[2]}</TableRowColumn>
                  <TableRowColumn style={{width: '120px'}}>{block[3]}</TableRowColumn>
                </TableRow>
            )
        }

        var rowsTransactions = []
        for (var i = 0; i < this.state.transactions.length; i++) {
            var tx = this.state.transactions[i]
            var argList = tx.slice(4).filter((item) => item != null).join(', ')
            console.log(tx.slice(4))
            rowsTransactions.push(
                <TableRow key={tx[0]}>
                  <TableRowColumn style={{width: '100px'}}>{tx[0]}</TableRowColumn>
                  <TableRowColumn style={{width: '100px'}}>{tx[1]}</TableRowColumn>
                  <TableRowColumn style={{width: '240px', fontFamily: 'Roboto Mono, Monospace'}}>{tx[2]}</TableRowColumn>
                  <TableRowColumn style={{width: '40px'}}>{tx[3]}</TableRowColumn>
                  <TableRowColumn style={{width: '240px'}}>{argList}</TableRowColumn>
                </TableRow>
            )
        }

        return (
            <MuiThemeProvider>
                <div className="application" style={{width: '100%', margin: 'auto'}}>
                    <div style={{'min-height': '400px'}}>
                      <Table selectable={false} >
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                          <TableRow>
                            <TableHeaderColumn style={{width: '100px'}}>Height</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '240px'}}>Timestamp</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '400px'}}>Hash</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '120px'}}>Transactions</TableHeaderColumn>
                          </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {rowsBlocks}
                        </TableBody>
                      </Table>
                  </div>
                  <div>
                      <Table selectable={false} >
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                          <TableRow>
                            <TableHeaderColumn style={{width: '100px'}}>Tx Id</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '100px'}}>Block</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '240px'}}>From</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '40px'}}>Action</TableHeaderColumn>
                            <TableHeaderColumn style={{width: '240px'}}>Arguments</TableHeaderColumn>
                          </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {rowsTransactions}
                        </TableBody>
                      </Table>
                  </div>
                </div>
            </MuiThemeProvider>


        )





    }
}

injectTapEventPlugin();

render(
    <Application />,
    document.getElementById('app')
);
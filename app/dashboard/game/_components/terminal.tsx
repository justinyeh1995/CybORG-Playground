'use client';
import { Terminal } from '@xterm/xterm';
import '@xterm/xterm/css/xterm.css';

import { WebLinksAddon } from '@xterm/addon-web-links';
import { AttachAddon } from '@xterm/addon-attach';

import React from 'react';
import { Card, CardContent, CardHeader } from '../ui/card'

interface TerminalComponentProps {
  gameID: string;
}

export default function TerminalComponent({gameID}: TerminalComponentProps) {
  const terminalRef = React.useRef<HTMLDivElement>(null);
  const terminalInstance = React.useRef<Terminal | null>(null);

  React.useEffect(() => {
    if (terminalInstance.current) {
      // Terminal already initialized
      return;
    }

    console.log('Initializing terminal');

    const terminal = new Terminal({
      cursorBlink: true,    // Blinking cursor
      rows: 30,             // Number of rows
      cols: 80,             // Number of columns
      theme: {
        background: '#000000', // Terminal background color
      },
    });
    terminalInstance.current = terminal;

    terminal.loadAddon(new WebLinksAddon());

    const socket = new WebSocket(`ws://localhost:5555/api/games/ws/${gameID}`);
    const attachAddon = new AttachAddon(socket);

    // Attach the socket to term
    terminal.loadAddon(attachAddon);
    
    terminal.open(terminalRef.current!);

    socket.onopen = () => {
      terminal.write('\r\n*** Connected to the server ***\r\n');
    };

    terminal.onData((data: string) => {
      terminal.write(data);
    });

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
      terminal.write('\r\n*** Disconnected from the server ***\r\n');
    };
  }, []);

  return (
    <Card>
        <CardHeader>
          <div className="flex space-x-2 mr-auto">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
          </div>
        </CardHeader>
        <CardContent className='h-full w-full p-0'>
          <div ref={terminalRef} />
        </CardContent>
    </Card>
  );
}
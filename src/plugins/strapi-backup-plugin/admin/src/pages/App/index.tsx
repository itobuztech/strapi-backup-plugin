/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { useState } from 'react';
import { Switch, Route } from 'react-router-dom';
import { AnErrorOccurred } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';
import { Loader } from '@strapi/design-system';

const App = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [processName, setProcessName] = useState('');

  const loading = async (boolValue:boolean, process:string) => {
    setIsLoading(boolValue);
    setProcessName(process);
  }
  

  const process_loader_styles: any= {
    display: 'flex', 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100vw',
    height: '100vh',
    background: 'black',
    left: '0',
    top: '0',
    right: '0',
    bottom: '0',
    position: 'absolute',
    zIndex: "999"
  }

  return (
    // <Switch>
    //   <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
    //   <Route component={AnErrorOccurred} />
    // </Switch>
    <>
    {isLoading == true? (
      <section className='process_loader' style={process_loader_styles}>
        <div>
          <h1 style={{color: "#fff"}}>{processName}...</h1>
          <Loader/>
        </div>
      </section>
      ): ((<>
         <HomePage loading={loading}/>
        </>
      ))}
   </>
  );
};

export default App;


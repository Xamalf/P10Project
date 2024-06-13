"use client";

import styles from './stateView.module.css';
import { forwardRef, useImperativeHandle } from "react";
import { handPoseMachineConfig } from './handPoseMachine';
import {createMachine } from 'xstate';
import { useMachine } from '@xstate/react';

const StateView = forwardRef((props: any, ref) => {
  const act = {
    actions: {
      timeOut:          () => { props.timeOut(); },
      goToNextSlide:    () => { props.nextSlide(); },
      goToPrevSlide:    () => { props.prevSlide(); },
      enablePointer:    () => { props.enablePointer(true); },
      machine_disabled: () => { props.toggleMode(false); }, 
      playstopVideo:    () => { props.playPause(); },
      videoMode:        () => { 
        props.toggleVid(true); 
        props.enablePointer(false);
      },
      presentationMode: () => {
        props.toggleMode(true);
        props.toggleVid(false);
        props.enablePointer(false);
      },
      moveslider:       () => {
        props.captureSlide(false);
      },
      movesliderDone:   () => {
        props.captureSlide(true);
      }
    }
  }

  const [state, send] = useMachine(createMachine(handPoseMachineConfig, act));

  useImperativeHandle(ref, () => ({
    newGesture: (gesture: string) => { newGesture(gesture); },
  }));

  async function newGesture(gesture: string) {
    switch(gesture) {     
        case 'Pointing':
        send({type: 'Pointing'});
        break;
        case 'FourFingersExt':
        send({type: 'FourFingersExt'});
        break;
        case 'TwoFingersSide':
        send({type: 'TwoFingersSide'});
        break;
        case 'TwoFingersUp':
        send({type: 'TwoFingersUp'});
        break;
        case 'Fist':
        send({type: 'Fist'});
        break;
        case 'Peace':
        send({type: 'Peace'});
        break;
        case 'Okay':
        send({type: 'Okay'});
        break;
        case 'OShape':
        send({type: 'OShape'});
        break;
        case 'none':
        send({type: 'NONE'});
        break;
        default:
        send({type: 'NONE'});
        break;
    }
  }

  return (
    <div className={styles.state}>
        <p>{state.value.toString()}</p>
    </div>
  );
});

StateView.displayName = 'StateView';

export default StateView;

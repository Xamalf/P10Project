export const handPoseMachineConfig = {
  id: 'handPose',
  initial: 'q_off',
  states: {
    q_off: {
      entry: ['machine_disabled'],
      on: {
        OShape: 'q_turnon'
      }
    },
    q_turnon: {
      on: {
        Peace: 'q_slide'
      },
      after: {
          2000: { target: 'q_off', actions: 'timeOut' }
      }
    },

    q_turnoff: {
      on: {
        Peace: 'q_off'
      },
      after: {
          2000: { target: 'q_slide', actions: 'timeOut' }
      }
    },

    q_slide: {
      entry: ['presentationMode'],
      on: {
          OShape: 'q_turnoff',
          Peace: 'q_tovideo',
          TwoFingersUp: 'q_next1',
          TwoFingersSide: 'q_prev1',
          Okay: 'q_moveslider1',
          Pointing: 'q_pointer1'
      },
      after: {
        800: { target: 'q_slide', actions: 'timeOut' }
      }
    },

    q_next1: {
      on: {
        TwoFingersSide: 'q_next2',
        Fist: 'q_slide'
        },

        after: {
          2000: { target: 'q_slide', actions: 'timeOut' }
        }
    },

    q_next2: {
      entry: ['goToNextSlide'],
      
      after: {
        10: { target: 'q_slide' }
      }
    },

    q_prev1: {
      on: {
        TwoFingersUp: 'q_prev2',
        Fist: 'q_slide'
        },

        after: {
          2000: { target: 'q_slide', actions: 'timeOut' }
        }
    },

    q_prev2: {
      entry: ['goToPrevSlide'],

      after: {
          10: { target: 'q_slide' }
      }
    },


    q_pointer1: {
      entry: ['enablePointer'],

      on: {
          Fist: 'q_slide'
      }
    },

    q_moveslider1: {
      entry: ['moveslider'],

      on: {
          Fist: 'q_movesliderDone1'
      }
    },

    q_movesliderDone1: {
      entry: ['movesliderDone'],

      after: {
          10: {target: 'q_slide' }
      }
      
    },

    q_tovideo: {
      on: {
        FourFingersExt: 'q_video',
        Fist: 'q_slide'
      },

      after: {
          2000: { target: 'q_slide', actions: 'timeOut' }
      }
    },

    q_toslide: {
      on: {
        FourFingersExt: 'q_slide',
        Fist: 'q_video'
      },

      after: {
          2000: {target: 'q_video', actions: 'timeOut' }
      }
    },

    q_video: {
      entry: ['videoMode'],
      on: {
          Peace: 'q_toslide',
          OShape: 'q_toplaystop',
          Okay: 'q_moveslider2',
          Pointing: 'q_pointer2'
      },
      after: {
        800: { target: 'q_video', actions: 'timeOut' }
      }
    },

    q_pointer2: {
      entry: ['enablePointer'],

      on: {
          Fist: 'q_video'
      }
    },

    q_toplaystop: {
      on: {
          Peace: 'q_playstop',
          Fist: 'q_video'
      },

      after: {
          2000: {target: 'q_video', actions: 'timeOut' }
      }
    },

    q_playstop: {
      entry: ['playstopVideo'],

      after: {
          10: {target: 'q_video' }
      }
      
    },

    q_moveslider2: {
      entry: ['moveslider'],

      on: {
          Fist: 'q_movesliderDone2'
      }
    },

    q_movesliderDone2: {
      entry: ['movesliderDone'],

      after: {
          10: {target: 'q_video' }
      }
      
    },
  }
};



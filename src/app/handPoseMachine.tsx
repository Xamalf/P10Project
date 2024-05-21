export const handPoseMachineConfig = {
  id: 'handPose',
  initial: 'q_off',
  states: {
    q_off: {
      entry: ['machine_disabled'],
      on: {
        Fist: 'q_turnon'
      }
    },
    q_turnon: {
      on: {
        Peace: 'q_slide'
      },
      after: {
          2000: { target: 'q_off' }
      }
    },

    q_turnoff: {
      on: {
        Peace: 'q_off'
      },
      after: {
          2000: { target: 'q_slide' }
      }
    },

    q_slide: {
      entry: ['presentationMode'],
      on: {
          Fist: 'q_turnoff',
          ThreeFingersExt: 'q_tovideo',
          TwoFingersUp: 'q_next1',
          TwoFingersSide: 'q_prev1',
          Pointing: 'q_pointer1'
      }
    },

    q_next1: {
      on: {
        TwoFingersSide: 'q_next2'
        },

        after: {
          2000: { target: 'q_slide' }
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
        TwoFingersUp: 'q_prev2'
        },

        after: {
          2000: { target: 'q_slide' }
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

    q_tovideo: {
      on: {
        Peace: 'q_video'
      },

      after: {
          2000: { target: 'q_slide' }
      }
    },

    q_toslide: {
      on: {
        Peace: 'q_slide'
      },

      after: {
          2000: {target: 'q_video'}
      }
    },

    q_video: {
      entry: ['videoMode'],
      on: {
          ThreeFingersExt: 'q_toslide',
          Fist: 'q_toplaystop',
          Okay: 'q_moveslider',
          Pointing: 'q_pointer2'
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
      },

      after: {
          2000: {target: 'q_video'}
      }
    },

    q_playstop: {
      entry: ['playstopVideo'],

      after: {
          10: {target: 'q_video'}
      }
      
    },

    q_moveslider: {
      entry: ['moveSlider'],

      on: {
          Fist: 'q_video'
      }
    },
  }
};



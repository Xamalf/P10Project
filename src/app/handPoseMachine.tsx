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
        IShape: 'q_slide'
      },
      after: {
          2000: { target: 'q_off' }
      }
    },

    q_turnoff: {
      on: {
          OShape: 'q_off'
      },
      after: {
          2000: { target: 'q_slide' }
      }
    },

    q_slide: {
      entry: ['presentationMode'],
      on: {
          IShape: 'q_turnoff',
          TwoFingersUp: 'q_tovideo',
          Okay: 'q_cs1',
          PalmTildedRight: 'q_next1',
          PalmTildedLeft: 'q_prev1',
          Pointing: 'q_pointer1'
      }
    },

    q_cs1: {
      on: {
        Poiting: 'q_cs1',
        TwoFingersExt: 'q_cs1',
        ThreeFingersExt: 'q_cs1',
        FourFingersExt: 'q_cs1',
        FiveFingersExt: 'q_cs1',
        Okay: 'q_cs2'
      },

      after: {
        2000: { target: 'q_slide' }
      }
    },

    q_cs2: {
      entry: ['goToSlideNumber'],

      after: {
        10: { target: 'q_slide' }
      }
    },

    q_next1: {
      on: {
          PalmUp: 'q_next2'
        },

        after: {
          2000: { target: 'q_slide' }
        }
    },

    q_next2: {
      on: {
          palm_prev1: 'q_next3'
        },

        after: {
          2000: { target: 'q_slide' }
        }
    },

    q_next3: {
      entry: ['goToNextSlide'],
      
      after: {
        10: { target: 'q_slide' }
      }
    },

    q_prev1: {
      on: {
          PalmUp: 'q_prev2'
        },

        after: {
          2000: { target: 'q_slide' }
        }
    },

    q_prev2: {
      on: {
          PalmTildedRight: 'q_prev3'
      },

      after: {
          2000: { target: 'q_slide' }
      }
    },

    q_prev3: {
      entry: ['goToPrevSlide'],

      after: {
          10: { target: 'q_slide' }
      }
    },


    q_pointer1: {
      entry: ['enablePointer'],

      on: {
          Fist: 'q_slide',
          Pointing: 'q_pointer1'
      }
    },

    q_tovideo: {
      on: {
          TwoFingersSide: 'q_video'
      },

      after: {
          2000: { target: 'q_slide' }
      }
    },

    q_toslide: {
      on: {
          TwoFingersSide: 'q_slide'
      },

      after: {
          2000: {target: 'q_video'}
      }
    },

    q_video: {
      entry: ['videoMode'],
      on: {
          TwoFingersUp: 'q_toslide',
          Fist: 'q_playstop',
          PalmTildedLeft: 'q_rev1',
          PalmTildedRight: 'q_ff1',
          Okay: 'q_vid1',
          Pointing: 'q_pointer2'
      }
    },

    q_pointer2: {
      on: {
          Fist: 'q_video'
      }
    },

    q_vid1: {
      on: {
          Poiting: 'q_vid1',
          TwoFingersExt: 'q_vid1',
          ThreeFingersExt: 'q_vid1',
          FourFingersExt: 'q_vid1',
          FiveFingersExt: 'q_vid1',
          Okay: 'q_vid2'
      },

      after: {
          2000: {target: 'q_video'}
      }
    },

    q_vid2: {
      entry: ['goToTimestamp'],

      after: {
          10: {target: 'q_video'}
      }
    },

    q_playstop: {
      on: {
          Peace: 'q_play',
          FourFingersExt: 'q_stop'
      },

      after: {
          2000: {target: 'q_video'}
      }
    },

    q_play: {
      entry: ['playVideo'],

      after: {
          10: {target: 'q_video'}
      }
      
    },

    q_stop: {
      entry: ['stopVideo'],

      after: {
          10: {target: 'q_video'}
      }
    },

    q_ff1: {
      on: {
          PalmUp: 'q_ff2'
      },

      after: {
          2000: { target: 'q_video' }
      }
    },

    q_ff2: {
      on: {
          PalmTildedLeft: 'q_ff3'
      },

      after: {
          2000: { target: 'q_video' }
      }
    },

    q_ff3: {
      entry: ['forward_video'],

      after: {
          10: { target: 'q_video'}
      }
    },

    q_rev1: {
      on: {
          PalmUp: 'q_rev2'
      },

      after: {
          2000: { target: 'q_video' }
      }
    },

    q_rev2: {
      on: {
          PalmTildedRight: 'q_rev3'
      },

      after: {
          2000: { target: 'q_video' }
      }
    },

    q_rev3: {
      entry: ['rewind_video'],

      after: {
          10: { target: 'q_video' }
      }
    }
  }
};



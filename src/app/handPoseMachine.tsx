import {createMachine } from 'xstate';

export const handPoseMachine = createMachine({
  id: 'handPose',
  initial: 'q_off',
  states: {
    q_off: {
      on: {
        ThumbsUp: 'q_turnon'
      },
      after: {
          2000: { target: 'q_off' }
      }
    },
    q_turnon: {
      on: {
        ThumbsDown: 'q_slide'
      },
      after: {
          2000: { target: 'q_off' }
      }
    },
    q_slide: {
      on: {
          ThumbsUp: 'q_turndown',
          TwoFingersUp: 'q_tovideo',
          thumbs_together: 'q_cs1',
          PalmTildedRight: 'q_next1',
          PalmTildedLeft: 'q_prev1',
          Pointing: 'q_pointer1'
      },
      after: {
          2000: { target: 'q_slide' }
      }
    },

    q_turndown: {
      on: {
          ThumbsDown: 'q_off'
      },
      after: {
          2000: { target: 'q_slide' }
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
      on: {
          TwoFingersUp: 'q_toslide',
          fist: 'q_playstop',
          PalmTildedLeft: 'q_rev1',
          PalmTildedRight: 'q_ff1',
          thumbs_together: 'q_vid1',
          Pointing: 'q_pointer2'
      }
    },

    q_vid1: {
      on: {
          Poiting: 'q_vid1',
          TwoFingersExt: 'q_vid1',
          ThreeFingersExt: 'q_vid1',
          FourFingersExt: 'q_vid1',
          FiveFingersExt: 'q_vid1',
          thumbs_together: 'q_vid2'
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
          peace: 'q_play',
          PalmUp: 'q_stop'
      },

      after: {
          10: {target: 'q_video'}
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
    },

    q_cs1: {
      on: {
        Poiting: 'q_cs1',
        TwoFingersExt: 'q_cs1',
        ThreeFingersExt: 'q_cs1',
        FourFingersExt: 'q_cs1',
        FiveFingersExt: 'q_cs1',
        thumbs_together: 'q_cs2'
      },

      after: {
        2000: { target: 'q_slide' }
      }
    },

    q_cs2: {
      entry: ['goToSlideNumber']
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
      entry: ['goToNextSlide']
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
      entry: ['goToPrevSlide']
    },

    q_pointer1: {
      on: {
          fist: 'q_slide'
      }
    },

    q_pointer2: {
      on: {
          fist: 'q_video'
      }
    },
  }
}, {
        actions: {
            goToTimestamp: (context, event) => {
                console.log('Go to timestamp')
            },

            playVideo: (context, event) => {
                console.log('Play video')
            },

            stopVideo: (context, event) => {
                console.log('Stop video')
            },

            forward_video: (context, event) => {
               console.log('Forward video')
            },

            rewind_video: (context, event) => {
                console.log('Rewind video')
            },

            goToSlideNumber: (context, event) => {
               console.log('Go to slide number')
            },

            goToNextSlide: (context, event) => {
               console.log('Go to next slide')
            },

            goToPrevSlide: (context, event) => {
                console.log('Go to previous slide')
            },

            enablePointer: (context, event) => {
                console.log('Enable pointer')
            }
        }
    }
);


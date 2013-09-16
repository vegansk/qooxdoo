/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2012 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (wittemann)


    Points - v0.1.1 - 2013-07-11
    Another Pointer Events polyfill

    http://rich-harris.github.io/Points
    Copyright (c) 2013 Rich Harris; Released under the MIT License

************************************************************************ */
/**
 * This class takes care of the normalization of the pointer events spec. A
 * library called Points.js by Rich Harris is used to accomplish this.
 *
 * <a href="http://www.w3.org/TR/pointerevents/">Specification</a> |
 * <a href="https://github.com/Rich-Harris/Points">Used framework</a>
 *
 * @ignore(UIEvent)
 */
qx.Bootstrap.define("qx.lang.normalize.PointerEvents", {

  defer : function() {
    (function () {

      'use strict';

      var activePointers,
        numActivePointers,
        recentTouchStarts,
        mouseDefaults,
        mouseEvents,
        i,
        setUpMouseEvent,
        createUIEvent,
        createEvent,
        createMouseProxyEvent,
        mouseEventIsSimulated,
        createTouchProxyEvent,
        buttonsMap,
        pointerEventProperties,
        addListener,
        dispatchEvent;


      // Pointer events supported? Great, nothing to do, let's go home
      if ( window.onpointerdown !== undefined ) {
        return;
      }

      pointerEventProperties = 'screenX screenY clientX clientY ctrlKey shiftKey altKey metaKey relatedTarget detail button buttons pointerId pointerType width height pressure tiltX tiltY isPrimary'.split( ' ' );

      // Can we create events using the MouseEvent constructor? If so, gravy
      try {
        i = new UIEvent( 'test' );

        createUIEvent = function ( type, bubbles ) {
          return new UIEvent( type, { view: window, bubbles: bubbles });
        };

      // otherwise we need to do things oldschool
      } catch ( err ) {
        if ( document.createEvent ) {
          createUIEvent = function ( type, bubbles ) {
            var pointerEvent = document.createEvent( 'UIEvents' );
            pointerEvent.initUIEvent( type, bubbles, true, window );

            return pointerEvent;
          };
        }
      }

      if ( !createUIEvent ) {
        throw new Error( 'Cannot create events. You may be using an unsupported browser.' );
      }


      addListener = function( target, type, callback, useCapture ) {
        target.addEventListener( type, callback, useCapture );
        // qxWeb(target).on(type, callback);
      };


      dispatchEvent = function( target, event ) {
        target.dispatchEvent( event );
      };


      [ 'pointerdown', 'pointerup', 'pointercancel', 'pointermove', 'pointerover', 'pointerout' ].forEach( function ( eventName ) {
        Element.prototype["on" + eventName] = null;
      });


      createEvent = function ( type, originalEvent, params, noBubble ) {
        var pointerEvent, i;

        pointerEvent = createUIEvent( type, !noBubble );

        i = pointerEventProperties.length;
        while ( i-- ) {
          Object.defineProperty( pointerEvent, pointerEventProperties[i], {
            value: params[ pointerEventProperties[i] ],
            writable: false
          });
        }

        Object.defineProperty( pointerEvent, 'originalEvent', {
          value: originalEvent,
          writable: false
        });

        Object.defineProperty( pointerEvent, 'preventDefault', {
          value: preventDefault,
          writable: false
        });

        return pointerEvent;
      };


      // add pointerEnabled property to navigator
      navigator.pointerEnabled = true;


      // If we're in IE10, these events are already supported, except prefixed
      if ( window.onmspointerdown !== undefined ) {
        [ 'MSPointerDown', 'MSPointerUp', 'MSPointerCancel', 'MSPointerMove', 'MSPointerOver', 'MSPointerOut' ].forEach( function ( prefixed ) {
          var unprefixed;

          unprefixed = prefixed.toLowerCase().substring( 2 );

          // pointerenter and pointerleave are special cases
          if ( unprefixed === 'pointerover' || unprefixed === 'pointerout' ) {
            addListener( window,  prefixed, function ( originalEvent ) {
              var unprefixedEvent = createEvent( unprefixed, originalEvent, originalEvent, false );
              dispatchEvent( originalEvent.target, unprefixedEvent );

              if ( !originalEvent.target.contains( originalEvent.relatedTarget ) ) {
                unprefixedEvent = createEvent( ( unprefixed === 'pointerover' ? 'pointerenter' : 'pointerleave' ), originalEvent, originalEvent, true );
                dispatchEvent( originalEvent.target, unprefixedEvent );
              }
            }, true );
          }

          else {
            addListener( window, prefixed, function ( originalEvent ) {
              var unprefixedEvent = createEvent( unprefixed, originalEvent, originalEvent, false );
              dispatchEvent( originalEvent.target, unprefixedEvent );
            }, true );
          }
        });

        navigator.maxTouchPoints = navigator.msMaxTouchPoints;

        // Nothing more to do.
        return;
      }


      // https://dvcs.w3.org/hg/pointerevents/raw-file/tip/pointerEvents.html#dfn-chorded-buttons
      buttonsMap = {
        0: 1,
        1: 4,
        2: 2
      };

      createMouseProxyEvent = function ( type, originalEvent, noBubble ) {
        var button, buttons, pressure, params, mouseEventParams, pointerEventParams;

        // normalise button and buttons
        if ( originalEvent.buttons !== undefined ) {
          buttons = originalEvent.buttons;
          button = !originalEvent.buttons ? -1 : originalEvent.button;
        }

        else {
          if ( event.button === 0 && event.which === 0 ) {
            button = -1;
            buttons = 0;
          } else {
            button = originalEvent.button;
            buttons = buttonsMap[ button ];
          }
        }

        // Pressure is 0.5 for buttons down, 0 for no buttons down (unless pressure is
        // reported, obvs)
        pressure = originalEvent.pressure || originalEvent.mozPressure || ( buttons ? 0.5 : 0 );


        // This is the quickest way to copy event parameters. You can't enumerate
        // over event properties in Firefox (possibly elsewhere), so a traditional
        // extend function won't work
        params = {
          screenX:       originalEvent.screenX,
          screenY:       originalEvent.screenY,
          clientX:       originalEvent.clientX,
          clientY:       originalEvent.clientY,
          ctrlKey:       originalEvent.ctrlKey,
          shiftKey:      originalEvent.shiftKey,
          altKey:        originalEvent.altKey,
          metaKey:       originalEvent.metaKey,
          relatedTarget: originalEvent.relatedTarget,
          detail:        originalEvent.detail,
          button:        button,
          buttons:       buttons,

          pointerId:     1,
          pointerType:   'mouse',
          width:         0,
          height:        0,
          pressure:      pressure,
          tiltX:         0,
          tiltY:         0,
          isPrimary:     true,

          preventDefault: preventDefault
        };

        return createEvent( type, originalEvent, params, noBubble );
      };

      // Some mouse events are real, others are simulated based on touch events.
      // We only want the real ones, or we'll end up firing our load at
      // inappropriate moments.
      //
      // Surprisingly, the coordinates of the mouse event won't exactly correspond
      // with the touchstart that originated them, so we need to be a bit fuzzy.
      if ( window.ontouchstart !== undefined ) {
        mouseEventIsSimulated = function ( event ) {
          var i = recentTouchStarts.length, threshold = 10, touch;
          while ( i-- ) {
            touch = recentTouchStarts[i];
            if ( Math.abs( event.clientX - touch.clientX ) < threshold && Math.abs( event.clientY - touch.clientY ) < threshold ) {
              return true;
            }
          }
        };
      } else {
        mouseEventIsSimulated = function () {
          return false;
        };
      }



      setUpMouseEvent = function ( type ) {
        if ( type === 'over' || type === 'out' ) {
          addListener( window, 'mouse' + type, function ( originalEvent ) {
            var pointerEvent;

            if ( mouseEventIsSimulated( originalEvent ) ) {
              return;
            }

            pointerEvent = createMouseProxyEvent( 'pointer' + type, originalEvent );
            dispatchEvent( originalEvent.target, pointerEvent );

            if ( !originalEvent.target.contains( originalEvent.relatedTarget ) ) {
              pointerEvent = createMouseProxyEvent( ( type === 'over' ? 'pointerenter' : 'pointerleave' ), originalEvent, true );
              dispatchEvent( originalEvent.target, pointerEvent );
            }
          });
        }

        else {
          addListener( window, 'mouse' + type, function ( originalEvent ) {
            var pointerEvent;

            if ( mouseEventIsSimulated( originalEvent ) ) {
              return;
            }

            pointerEvent = createMouseProxyEvent( 'pointer' + type, originalEvent );
            dispatchEvent( originalEvent.target, pointerEvent );
          });
        }
      };

      [ 'down', 'up', 'over', 'out', 'move' ].forEach( function ( eventType ) {
        setUpMouseEvent( eventType );
      });





      // Touch events:
      if ( window.ontouchstart !== undefined ) {
        // Set up a registry of current touches
        activePointers = {};
        numActivePointers = 0;

        // Maintain a list of recent touchstarts, so we can eliminate simulate
        // mouse events later
        recentTouchStarts = [];

        createTouchProxyEvent = function ( type, originalEvent, touch, noBubble, relatedTarget ) {
          var params;

          params = {
            screenX:       originalEvent.screenX,
            screenY:       originalEvent.screenY,
            clientX:       touch.clientX,
            clientY:       touch.clientY,
            ctrlKey:       originalEvent.ctrlKey,
            shiftKey:      originalEvent.shiftKey,
            altKey:        originalEvent.altKey,
            metaKey:       originalEvent.metaKey,
            relatedTarget: relatedTarget || originalEvent.relatedTarget, // TODO is this right? also: mouseenter/leave?
            detail:        originalEvent.detail,
            button:        0,
            buttons:       1,

            pointerId:     touch.identifier + 2, // ensure no collisions between touch and mouse pointer IDs
            pointerType:   'touch',
            width:         20, // roughly how fat people's fingers are
            height:        20,
            pressure:      0.5,
            tiltX:         0,
            tiltY:         0,
            isPrimary:     activePointers[ touch.identifier ].isPrimary,

            preventDefault: preventDefault
          };

          return createEvent( type, originalEvent, params, noBubble );
        };

        // touchstart
        addListener( window, 'touchstart', function ( event ) {
          var touches, processTouch;

          touches = event.changedTouches;

          processTouch = function ( touch ) {
            var pointerdownEvent, pointeroverEvent, pointerenterEvent, pointer;

            pointer = {
              target: touch.target,
              isPrimary: numActivePointers ? false : true
            };

            activePointers[ touch.identifier ] = pointer;
            numActivePointers += 1;

            pointerdownEvent = createTouchProxyEvent( 'pointerdown', event, touch );
            pointeroverEvent = createTouchProxyEvent( 'pointerover', event, touch );
            pointerenterEvent = createTouchProxyEvent( 'pointerenter', event, touch, true );

            dispatchEvent( touch.target, pointeroverEvent );
            dispatchEvent( touch.target, pointerenterEvent );
            dispatchEvent( touch.target, pointerdownEvent );

            // we need to keep track of recent touchstart events, so we can test
            // whether later mouse events are simulated
            recentTouchStarts.push( touch );
            setTimeout( function () {
              var index = recentTouchStarts.indexOf( touch );
              if ( index !== -1 ) {
                recentTouchStarts.splice( index, 1 );
              }
            }, 1500 );
          };

          for ( i=0; i<touches.length; i+=1 ) {
            processTouch( touches[i] );
          }
        });

        // touchmove
        addListener( window, 'touchmove', function ( event ) {
          var touches, processTouch;

          touches = event.changedTouches;

          processTouch = function ( touch ) {
            var pointermoveEvent, pointeroverEvent, pointeroutEvent, pointerenterEvent, pointerleaveEvent, pointer, previousTarget, actualTarget;

            pointer = activePointers[ touch.identifier ];
            actualTarget = document.elementFromPoint( touch.clientX, touch.clientY );

            if ( pointer.target === actualTarget ) {
              // just fire a touchmove event
              pointermoveEvent = createTouchProxyEvent( 'pointermove', event, touch );
              dispatchEvent( actualTarget, pointermoveEvent );
              return;
            }


            // target has changed - we need to fire a pointerout (and possibly pointerleave)
            // event on the previous target, and a pointerover (and possibly pointerenter)
            // event on the current target. Then we fire the pointermove event on the current
            // target

            previousTarget = pointer.target;
            pointer.target = actualTarget;

            // pointerleave
            if ( !previousTarget.contains( actualTarget ) ) {
              // new target is not a child of previous target, so fire pointerleave on previous
              pointerleaveEvent = createTouchProxyEvent( 'pointerleave', event, touch, true, actualTarget );
              dispatchEvent( previousTarget, pointerleaveEvent );
            }

            // pointerout
            pointeroutEvent = createTouchProxyEvent( 'pointerout', event, touch, false );
            dispatchEvent( previousTarget, pointeroutEvent );

            // pointermove
            pointermoveEvent = createTouchProxyEvent( 'pointermove', event, touch, false );
            dispatchEvent( actualTarget, pointermoveEvent );

            // pointerover
            pointeroverEvent = createTouchProxyEvent( 'pointerover', event, touch, false );
            dispatchEvent( actualTarget, pointeroverEvent );

            // pointerenter
            if ( !actualTarget.contains( previousTarget ) ) {
              // previous target is not a child of current target, so fire pointerenter on current
              pointerenterEvent = createTouchProxyEvent( 'pointerenter', event, touch, true, previousTarget );
              dispatchEvent( actualTarget, pointerenterEvent );
            }
          };

          for ( i=0; i<touches.length; i+=1 ) {
            processTouch( touches[i] );
          }
        });

        // touchend
        addListener( window, 'touchend', function ( event ) {
          var touches, processTouch;

          touches = event.changedTouches;

          processTouch = function ( touch ) {
            var pointerupEvent, pointeroutEvent, pointerleaveEvent, previousTarget, actualTarget;

            actualTarget = document.elementFromPoint( touch.clientX, touch.clientY );

            pointerupEvent = createTouchProxyEvent( 'pointerup', event, touch, false );
            pointeroutEvent = createTouchProxyEvent( 'pointerout', event, touch, false );
            pointerleaveEvent = createTouchProxyEvent( 'pointerleave', event, touch, true );

            delete activePointers[ touch.identifier ];
            numActivePointers -= 1;

            dispatchEvent( actualTarget, pointerupEvent );
            dispatchEvent( actualTarget, pointeroutEvent );
            dispatchEvent( actualTarget, pointerleaveEvent );
          };

          for ( i=0; i<touches.length; i+=1 ) {
            processTouch( touches[i] );
          }
        });

        // touchcancel
        addListener( window, 'touchcancel', function ( event ) {
          var touches, processTouch;

          touches = event.changedTouches;

          processTouch = function ( touch ) {
            var pointercancelEvent, pointeroutEvent, pointerleaveEvent;

            pointercancelEvent = createTouchProxyEvent( 'pointercancel', event, touch );
            pointeroutEvent = createTouchProxyEvent( 'pointerout', event, touch );
            pointerleaveEvent = createTouchProxyEvent( 'pointerleave', event, touch );

            dispatchEvent( touch.target, pointercancelEvent );
            dispatchEvent( touch.target, pointeroutEvent );
            dispatchEvent( touch.target, pointerleaveEvent );

            delete activePointers[ touch.identifier ];
            numActivePointers -= 1;
          };

          for ( i=0; i<touches.length; i+=1 ) {
            processTouch( touches[i] );
          }
        });
      }


      // Single preventDefault function - no point recreating it over and over
      function preventDefault () {
        this.originalEvent.preventDefault();
      }

    }());
  }
});

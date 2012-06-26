var Squiddle = ( function( console, exports )
{
    "use strict";
    
    console = console || {
        log: function () {},
        dir: function () {}
    };
    
    exports = exports || {};
    
    var Sq, asyncThrow;
    
    Sq = function( args )
    {
        args = args || {};
        
        if ( !( this instanceof Sq ) )
        {
            return new Sq( args );
        }
        
        this.debug = args.debug || false;
        this.interceptErrors = args.interceptErrors || false;
        this.log = args.log || false;
        this.logData = args.logData || false;
        
        this.callbacks = {
            "*": []
        };
        
        var self = this,
        errorListener;
        
        errorListener = function( data, info )
        {
            if ( self.debug !== true )
            {
                return;
            }
            var name = data.error.name || "Error";
            console.log(
                name + " in listener; Event: " + data.info.event + "; Message: " + data.error.message);
        };
        
        this.subscribe( errorListener, "squiddle.error" );
    };
    
    Sq.create = function(args)
    {
        args = args || {};
        return new Sq(args);
    };
    
    Sq.prototype.subscribe = function( listener, event )
    {
        if (typeof event !== "undefined" && typeof event !== "string" && typeof event !== "number")
        {
            throw new Error("Event names can only be strings or numbers!");
        }
        
        if (typeof listener !== "function")
        {
            throw new Error("Only functions may be used as listeners!");
        }
        event = event || '*';
        
        this.callbacks[ event ] = this.callbacks[ event ] || [];
        this.callbacks[ event ].push( listener );
        this.trigger(
            "squiddle.subscribe", 
            {
                listener: listener,
                event: event,
                bus: this
            }
        );
    };
    
    Sq.prototype.unsubscribe = function( listener, event )
    {
        if (typeof event !== "undefined" && typeof event !== "string" && typeof event !== "number")
        {
            throw new Error("Event names can only be strings or numbers!");
        }
        
        event = event || '*';
        var cbs = this.callbacks[ event ] || [],
        len = cbs.length,
        i;
        
        for ( i = 0; i < len; ++i )
        {
            if ( cbs[i] === listener )
            {
                this.callbacks[ event ].splice( i, 1 );
            }
        }
        this.trigger(
            "squiddle.unsubscribe", 
            {
                listener: listener,
                event: event,
                bus: this
            }
        );
    };
    
    
    Sq.prototype.trigger = function( event, data, async )
    {
        if (typeof event !== "undefined" && typeof event !== "string" && typeof event !== "number")
        {
            throw new Error("Event names can only be strings or numbers!");
        }
        
        event = event || "*";
        data = data || null;
        async = async || true;
        async = ( async === false ) ? false : true;
        
        var cbs, len, info, j, f, cur, self = this;
        
        // get subscribers in all relevant namespaces
        cbs = ( function()
        {
            var n, words, wc, matches, k, kc, old = "",
            out = [];
            // split event name into namespaces and get all subscribers
            words = event.split( "." );
            
            for ( n = 0, wc = words.length; n < wc; ++n )
            {
                old = old + ( n > 0 ? "." : "" ) + words[ n ];
                matches = self.callbacks[ old ] || [];
                for ( k = 0, kc = matches.length; k < kc; ++k )
                {
                    out.push( matches[ k ] );
                }
            }
            if ( event === "*" )
            {
                return out;
            }
            // get subscribers for "*" and add them, too
            matches = self.callbacks[ "*" ] || [];
            for ( k = 0, kc = matches.length; k < kc; ++k )
            {
                out.push( matches[ k ] );
            }
            return out;
        })();
            
        len = cbs.length;
            
        info = {
            event: event,
            subscribers: len,
            getQueueLength: function()
            {
                if (len === 0)
                {
                    return 0;
                }
                return len - (j + 1);
            }
        };
        
        asyncThrow = function( e )
        {
            setTimeout(        
                function ()
                {
                    throw e;
                }, 
                0
            );
        };
            
        // function for iterating through the list of relevant listeners
        f = function()
        {
            if ( self.log === true )
            {
                console.log( 
                    "Squiddle event triggered: " + event + "; Subscribers: " + len, 
                    self.logData === true ? "; Data: " + data : "" 
                );
            }
            for ( j = 0; j < len; ++j )
            {
                cur = cbs[j];
                try
                {
                    cur( data, info );
                }
                catch ( e )
                {
                    console.log( "Error is: " + e );
                    self.trigger(
                        "squiddle.error", 
                        {
                            error: e,
                            info: info
                        }
                    );
                    if ( self.interceptErrors !== true )
                    {
                        asyncThrow( e );
                    }
                }
            }
        };
            
        if ( async === true )
        {
            setTimeout( f, 0 );
        }
        else
        {
            f();
        }
    };
    
    exports.create = Sq;
    
    return Sq;
    
}( 
    typeof console === "undefined" ? false : console, 
    typeof exports === "undefined" ? false : exports 
));
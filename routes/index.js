// GLOBALS
var utils    = require( '../utils' );
var mongoose = require( 'mongoose' );
var Todo     = mongoose.model( 'Todo' );
// SUPERMARKETS
var peas_and_pickles = {
  name : "Peas & Pickles",
  imageUrl : "http://45.33.83.229:3001/images/whole_foods.jpg",
  products : [
    {
      UPC: "1234567890",
      name: "Number",
      imageUrl: "http://45.33.83.229:3001/images/whole_foods.jpg",
      price: "4.5"
    }
  ],
  promoted : [
    "1234567890", "0987654321", "321312231231"
  ]
};
var foragers_market = {
  name : "Foragers Market",
  imageUrl : "http://45.33.83.229:3001/images/whole_foods.jpg",
  products : [
    {
      UPC: "1234567890",
      name: "Number",
      imageUrl: "http://45.33.83.229:3001/images/whole_foods.jpg",
      price: "4.5"
    }
  ],
  promoted : [
    "1234567890", "0987654321"
  ]
};
// DASHBOARD SYSTEM
exports.index = function ( req, res, next ){
  var user_id = req.cookies ?
    req.cookies.user_id : undefined;

  Todo.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'index', {
          title : 'Express Todo Example',
          todos : todos
      });
    });
};

exports.create = function ( req, res, next ){
  console.log(req.body.content);
  new Todo({
      user_id    : req.cookies.user_id,
      content    : req.body.content,
      updated_at : Date.now()
  }).save( function ( err, todo, count ){
    if( err ) return next( err );

    res.redirect( '/' );
  });
};

exports.destroy = function ( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){
    var user_id = req.cookies ?
      req.cookies.user_id : undefined;

    if( todo.user_id !== user_id ){
      return utils.forbidden( res );
    }

    todo.remove( function ( err, todo ){
      if( err ) return next( err );

      res.redirect( '/' );
    });
  });
};

exports.edit = function( req, res, next ){
  var user_id = req.cookies ?
      req.cookies.user_id : undefined;

  Todo.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'edit', {
        title   : 'Express Todo Example',
        todos   : todos,
        current : req.params.id
      });
    });
};

exports.update = function( req, res, next ){
  Todo.findById( req.params.id, function ( err, todo ){
    var user_id = req.cookies ?
      req.cookies.user_id : undefined;

    if( todo.user_id !== user_id ){
      return utils.forbidden( res );
    }

    todo.content    = req.body.content;
    todo.updated_at = Date.now();
    todo.save( function ( err, todo, count ){
      if( err ) return next( err );

      res.redirect( '/' );
    });
  });
};

// ** express turns the cookie key to lowercase **
exports.current_user = function ( req, res, next ){
  var user_id = req.cookies ?
      req.cookies.user_id : undefined;

  if( !user_id ){
    res.cookie( 'user_id', utils.uid( 32 ));
  }

  next();
};

exports.welcome = function ( req, res, next ){
  var user_id = req.cookies ?
    req.cookies.user_id : undefined;

  Todo.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'welcome');
    });
};

exports.register = function ( req, res, next ){
  var user_id = req.cookies ?
    req.cookies.user_id : undefined;

  Todo.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'register', {
          title : 'Kangaroo | Register',
          todos : todos
      });
    });
};

exports.login = function ( req, res, next ){
  var user_id = req.cookies ?
    req.cookies.user_id : undefined;

  Todo.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'login', {
          title : 'Kangaroo | Login',
          todos : todos
      });
    });
};

exports.dash = function ( req, res, next ){
  var user_id = req.cookies ?
    req.cookies.user_id : undefined;

  Todo.
    find({ user_id : user_id }).
    sort( '-updated_at' ).
    exec( function ( err, todos ){
      if( err ) return next( err );

      res.render( 'dash', {
          title : 'Kangaroo | Dashboard',
          todos : todos
      });
    });
};
// API SYSTEM
exports.store = function ( req, res, next ) {
  res.type('application/json');
  if (req.params.id == "ChIJZaiaZzFawokReXz6BSpjDCs") // Peas & Pickles
    res.json(peas_and_pickles);
  else if (req.params.id == "ChIJl5_N4DNawokRZPThIb1Aqy8") // Foragers Market
    res.json(foragers_market);
  else
    res.send("place_id not found");
};

exports.checkout = function ( req, res, next ) {
  res.type('text/plain');
  console.log(req.body);
  res.send(req.body);
};
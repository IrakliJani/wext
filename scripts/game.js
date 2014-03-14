if (isMobile()) {
  redirect('/');
}

var peer = new Peer({ key: 'z0bavx5ok1emi', debug: 2 });

peer.on('open', function(id) {
  window.location.hash = id;
});

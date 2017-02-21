function init() {
    // document.getElementById('load-end').addEventListener('click', function () {
    //     document.getElementById('music').src = '/asset/music/button.mp3';
    //     document.getElementById('music').play();
    // });

    lynx.initPhysi();

    var stats = lynx.initStats("stats");
    var renderer = lynx.initRenderer('game');

    var world = new lynx.World("paw", renderer.domElement);

    var clock = new THREE.Clock();

    animate();

    function animate() {
        requestAnimationFrame(animate);
        if (world.state === lynx.worldState.PLAY) {
            render();
        }
    }

    function render() {
        var delta = clock.getDelta();

        world.update(delta);

        stats.update();

        renderer.render(world.scene, world.getCamera());

    }
}

window.onload = init;

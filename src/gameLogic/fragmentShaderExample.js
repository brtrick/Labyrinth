shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      [
        ...woodFunctions,
        'void main() {'
      ].join( '\n' )
    ).replace(
      '#include <uv_pars_fragment>',
      [
        '#include <uv_pars_fragment>',
        'varying vec3 localPosition;',
        'uniform vec4 posSize1;',
      ].join( '\n' )
    ).replace(
      '#include <map_fragment>',
      woodColor.join( '\n' )
    ).replace(
      'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
      [
        'if(length(posSize1.xyz - localPosition) < posSize1.w * 0.99){',
        'diffuseColor.a = 0.0;',
        '}',
        'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
      ].join( '\n' )
    );
    shader.uniforms.posSize1 = {value: new THREE.Vector4(0,10,0,hSize)};
    
    mainMaterialShader = shader;
  }
}
function SetHoleMaterial(){
  holeMaterial = new THREE.MeshStandardMaterial(materialParams);
  holeMaterial.side = THREE.BackSide;
  holeMaterial.onBeforeCompile = function ( shader ) {
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <uv_pars_vertex>',
      [
        '#include <uv_pars_vertex>',
        'varying vec3 localPosition;'
      ].join( '\n' )
    ).replace(
      '#include <uv_vertex>',
      [
        'localPosition = vec3(position);',
        '#include <uv_vertex>',
      ].join( '\n' )
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      [
        ...woodFunctions,
        'void main() {'
      ].join( '\n' )
    ).replace(
      '#include <uv_pars_fragment>',
      [
        '#include <uv_pars_fragment>',
        'varying vec3 localPosition;',
        'uniform vec4 posSize1;',
        'uniform float mainSize;',
      ].join( '\n' )
    ).replace(
      '#include <map_fragment>',
      woodColorHole.join( '\n' )
    ).replace(
      'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
      [
        //'vec3 hPos = vec3(0.0,10.0,0.0);',
        'if(length(posSize1.xyz + localPosition) > 10.0){',
        'diffuseColor.a = 0.0;',
        '}',
        'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
      ].join( '\n' )
    );
    
    shader.uniforms.mainSize = {value: 10}
    shader.uniforms.posSize1 = {value: new THREE.Vector4(0,10,0,hSize)}
    
    
    holeMaterialShader = shader;
  }
}
function SetHoleMaterialCube(){
  holeMaterialCube = new THREE.MeshStandardMaterial(materialParams);
  holeMaterialCube.side = THREE.BackSide;
  holeMaterialCube.onBeforeCompile = function ( shader ) {
    
    shader.vertexShader = shader.vertexShader.replace(
      '#include <uv_pars_vertex>',
      [
        '#include <uv_pars_vertex>',
        'varying vec3 localPosition;'
      ].join( '\n' )
    ).replace(
      '#include <uv_vertex>',
      [
        'localPosition = vec3(position);',
        '#include <uv_vertex>',
      ].join( '\n' )
    );
    
    shader.fragmentShader = shader.fragmentShader.replace(
      'void main() {',
      [
        ...woodFunctions,
        'void main() {'
      ].join( '\n' )
    ).replace(
      '#include <uv_pars_fragment>',
      [
        '#include <uv_pars_fragment>',
        'varying vec3 localPosition;',
        'uniform vec4 posSize1;',
        'uniform float mainSize;',
      ].join( '\n' )
    ).replace(
      '#include <map_fragment>',
      woodColorHole.join( '\n' )
    ).replace(
      'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
      [
        //'vec3 hPos = posSize1.xyz + localPosition;',
        'if(hPos.x > 10.0 || hPos.x < -10.0 || hPos.y > 10.0 || hPos.y < -10.0 || hPos.z > 10.0 || hPos.z < -10.0){',
        'diffuseColor.a = 0.0;',
        '}',
        'gl_FragColor = vec4( outgoingLight, diffuseColor.a );',
      ].join( '\n' )
    );
    
    shader.uniforms.mainSize = {value: 10}
    shader.uniforms.posSize1 = {value: new THREE.Vector4(0,10,0,hSize)}
    
    
    holeMaterialCubeShader = shader;
  }
}
function init(){
  
  renderer = new THREE.WebGLRenderer({alpha:true, antialias:true});
  renderer.setSize( window.innerWidth, window.innerHeight );
  renderer.autoClear = false;
  document.body.appendChild( renderer.domElement );
  
  scene = new THREE.Scene();
  sceneH = new THREE.Scene();
  camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set(40, 20, -40);
  cameraH = camera.clone();
  var ambientLight = new THREE.AmbientLight( 0x404040 );
  var light = new THREE.PointLight( 0xffffff, 0.8, 1000 );
  camera.add(light);
  cameraH.add(light.clone());
  // controls
  controls = new THREE.OrbitControls( camera );
  var controlsH = new THREE.OrbitControls( cameraH );
  
  var path = new THREE.Path();
  curve = new THREE.CatmullRomCurve3( [
    new THREE.Vector3( -10,0,-12 ),
    new THREE.Vector3( 5,-4,0),
    new THREE.Vector3( -10,0,10),
    new THREE.Vector3( -8,3,0),

  ] );
  curve.closed = true;
  var points = curve.getPoints( 150 );
  var geometry = new THREE.BufferGeometry().setFromPoints( points );

  var material = new THREE.LineBasicMaterial( { color : 0xff0000 } );

  curveObject = new THREE.Line( geometry, material );

  //var mainSphereGeo = new THREE.SphereGeometry( 10, 100, 100 );
  var mainSphereGeo = new THREE.BoxGeometry( 20, 20, 20 );
  var holeSphereGeo = new THREE.SphereGeometry( hSize, 80, 80 );
  
  var HelperGeo = new THREE.SphereGeometry(hSize, 12, 12);
  var HelperWireframe = new THREE.WireframeGeometry(HelperGeo);
  HelperMesh = new THREE.LineSegments( HelperWireframe );
  HelperMesh.material.depthTest = false;
  HelperMesh.material.opacity = 0.5;
  HelperMesh.material.transparent = true;
  mainSphere = new THREE.Mesh(mainSphereGeo, mainMaterial);
  holeSphere = new THREE.Mesh(holeSphereGeo, holeMaterialCube);
  holeSphere.position.set(0,10,0);
  
  holeSphere.add(HelperMesh);
  
  scene.add(camera,mainSphere,curveObject);//, ambientLight
  sceneH.add(cameraH,holeSphere);//,ambientLight.clone()
  
  startTime = new Date().getTime();
}

function animate(){
  requestAnimationFrame( animate );
  
  var time = (new Date().getTime() - startTime)/8000;

  var alpha = -(Math.floor(time) - time);
  curve.getPoint( alpha, holeSphere.position );
  var posSize1 = new THREE.Vector4(holeSphere.position.x, holeSphere.position.y, holeSphere.position.z, hSize);
  if(mainMaterialShader){
    mainMaterialShader.uniforms.posSize1.value.copy(posSize1);
  }
  if(holeMaterialShader){
    holeMaterialShader.uniforms.posSize1.value.copy(posSize1);
  }
  if(holeMaterialCubeShader){
    holeMaterialCubeShader.uniforms.posSize1.value.copy(posSize1);
  }
  renderer.render(sceneH, cameraH);
  renderer.clearDepth();
  renderer.render( scene, camera );
}
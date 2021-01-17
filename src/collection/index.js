module.exports = {
  allPaths,
  allPathsTo
};

function allPaths({maxPaths = -1, rootIds = [], directed = false, target = null} = {}) {

  let eles = this;
  let cy = this.cy();

  // 1. Find all root nodes
  let rootNodes = [];
  if (rootIds.length === 0) {
    rootNodes = eles.roots();
  } else {
    rootNodes = rootIds.map(id => cy.$id(id)).filter(item => item.length > 0);
  }

  // 2. Start with each root node and traverse all paths
  let allPaths = []; // [[node, edge, node, edge, ...], ...]
  rootNodes.forEach(rNode => {
    traversing(rNode, [rNode]);
  });

  function traversing(node, preNodes) {

    if (maxPaths >= 0 && allPaths.length >= maxPaths) return;

    if (!node) {
      // It's the ending node
      allPaths.push(preNodes);
      return;
    }

    if (directed && target !== null && target === node.id()){
      // It's the ending node in directed graph
      allPaths.push(preNodes);
      return;
    }

    let nextEles;
    if(!directed){
      nextEles = getOutgoers(node);
    } else {
      nextEles = getDirectedOutgoers(node, preNodes);
    }

    if (nextEles.length === 0) {
      // It's the ending node
      allPaths.push(preNodes);
    } else {
      nextEles.forEach(pairEles => {
        if (preNodes.find(item => item.id() === pairEles[1].id())) {
          // Prevent circular dependence
          traversing(null, preNodes.concat(pairEles));
        } else {
          traversing(pairEles[1], preNodes.concat(pairEles));
        }
      });
    }
  }

  function getDirectedOutgoers(node, preNodes){

    let outgoers = node.outgoers();

    let pos = -1;
    for(let i = 0; i < outgoers.length; i++){
      
      // outgoers is node and node is already inside preNodes (visited)
      if(i % 2 !== 0 && preNodes.find( (item) => { return item.id() === outgoers[i].id() })){
        // save the position
        pos = i;
        break;
      }
    }

    // delete edge and node
    if( pos > -1)
      outgoers.splice(pos - 1, 2);

    let nextEles = []; // [[edge, node], ...]
    let eles = []; // [edge, node]
    outgoers.forEach((oEle, idx) => {
      if (idx % 2 == 0) {
        // even
        eles = [];
        eles.push(oEle);
      } else {
        // odd
        eles.push(oEle);
        nextEles.push(eles);
      }
    });
    return nextEles;

  }

  function getOutgoers(node) {
    let outgoers = node.outgoers();
    let nextEles = []; // [[edge, node], ...]
    let eles = []; // [edge, node]
    outgoers.forEach((oEle, idx) => {
      if (idx % 2 == 0) {
        // even
        eles = [];
        eles.push(oEle);
      } else {
        // odd
        eles.push(oEle);
        nextEles.push(eles);
      }
    });
    return nextEles;
  }

  let allPathsCollection = [];
  allPaths.forEach(pathItem => {
    let pathCollection = cy.collection(pathItem)
    allPathsCollection.push(pathCollection);
  });

  return allPathsCollection; // chainability
};

function allPathsTo(target, {maxPaths = -1, rootIds = []}){

  return allPaths.apply(this, [Object.assign({maxPaths, rootIds}, {target, directed: true})]);
}
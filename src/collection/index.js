module.exports = function({maxPaths = -1} = {}) {
  let eles = this;
  let cy = this.cy();

  // 1. Find all root node
  let rootNodes = eles.roots();

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

    let nextEles = getOutgoers(node);
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

  function getOutgoers(node) {
    let outgoers = node.outgoers();
    let nextEles = []; // [[node, edge], ...]
    let eles = []; // [node, edge]
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


function shortestDistanceHelper() {
  let shortestDistanceNode = (distances, visited) => {
    // create a default value for shortest
    let shortest = null;
    
      // for each node in the distances object
    for (let node in distances) {
        // if no node has been assigned to shortest yet
        // or if the current node's distance is smaller than the current shortest
      let currentIsShortest =
        shortest === null || distances[node] < distances[shortest];
            
        // and if the current node is in the unvisited set
      if (currentIsShortest && !visited.includes(node)) {
              // update shortest to be the current node
        shortest = node;
      }
    }
    return shortest;
  };
}

export function one(_input: string[]): number {
  return 0;
}

export function two(_input: string[]): number {
  return 0;
}

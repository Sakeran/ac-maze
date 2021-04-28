/**
 * Union-Find data structure
 */
class UnionFind {
  /**
   * Initializes the UnionFind structure with the given key function
   * @param {function} keyFn Key function for objects, also used to identify groups
   */
  constructor(keyFn) {
    this.keyFn = keyFn;

    this.objects = new Map();
    this.size = 0;
  }

  /**
   * Adds the given object to the UnionFind structure.
   * @param {*} o Object to add.
   */
  add(o) {
    const key = this.keyFn(o);
    const node = { key, rank: 0 };
    node.parent = node;

    this.objects.set(key, node);
    this.size += 1;
  }

  /**
   * Merge the two groups beloning to each given object into one.
   * @param {*} o1
   * @param {*} o2
   */
  merge(o1, o2) {
    if (this.hasSameGroup(o1, o2)) return;

    let x = this.objects.get(this.keyFn(o1));
    let y = this.objects.get(this.keyFn(o2));

    if (!x || !y) return;

    x = this.findNode(x);
    y = this.findNode(y);

    if (x.rank < y.rank) {
      const t = x;
      x = y;
      y = t;
    }

    if (x.rank === y.rank) {
      x.rank += 1;
    }

    y.parent = x;
  }

  /**
   * Returns the id for the group object o belongs to.
   * @param {*} o Object to find.
   */
  find(o) {
    let node = this.objects.get(this.keyFn(o));
    if (!node) return null;

    const parentNode = this.findNode(node);

    node.parent = parentNode;
    return parentNode.key;
  }

  findNode(n) {
    let node = n;

    while (node.parent != node) {
      node = node.parent;
    }

    return node;
  }

  /**
   * Returns true if the two object have the same group
   * @param {*} o1
   * @param {*} o2
   */
  hasSameGroup(o1, o2) {
    return this.find(o1) === this.find(o2);
  }

  /**
   * Returns the number of components in the structure
   * @returns
   */
  componentCount() {
    const set = new Set();
    for (const node of this.objects.values()) {
      const parentKey = this.findNode(node).key;
      set.add(parentKey);
    }

    return set.size;
  }
}

module.exports = UnionFind;

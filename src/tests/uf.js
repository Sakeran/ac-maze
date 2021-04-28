const expect = require("chai").expect;

const UnionFind = require("../js/UF");

// Helpers

const Point = (x, y) => ({
  x,
  y,
});

const key = ({ x, y }) => `${x}:${y}`;

describe("Union-Find", () => {
  let uf;
  beforeEach(() => {
    uf = new UnionFind(key);
  });

  it("Can add new elements", () => {
    uf.add(Point(0, 0));
    expect(uf.size).to.equal(1);

    uf.add(Point(0, 1));
    expect(uf.size).to.equal(2);
  });

  it("Initializes each element's parent to itself", () => {
    const a = Point(0, 0);
    const b = Point(1, 2);
    const c = Point(2, 3);

    uf.add(a);
    uf.add(b);
    uf.add(c);

    expect(uf.find(a)).to.equal(key(a));
    expect(uf.find(b)).to.equal(key(b));
    expect(uf.find(c)).to.equal(key(c));
  });

  it("Can merge two elements", () => {
    const a = Point(0, 0);
    const b = Point(1, 2);

    uf.add(a);
    uf.add(b);

    uf.merge(a, b);

    expect(uf.find(a) === uf.find(b));
    // One's key should be set to the other's
    expect(uf.find(a) === key(b) || uf.find(b) === key(a)).to.be.true;
  });

  it("Can merge three elements", () => {
    const a = Point(0, 0);
    const b = Point(1, 2);
    const c = Point(2, 3);

    uf.add(a);
    uf.add(b);
    uf.add(c);

    uf.merge(a, b);
    uf.merge(b, c);

    expect(uf.find(a) === uf.find(b) && uf.find(b) === uf.find(c)).to.be.true;
  });

  it("Can count the number of connected components", () => {
    const a = Point(0, 0);
    const b = Point(1, 2);
    const c = Point(2, 3);
    const d = Point(4, 5);
    const e = Point(6, 7);

    uf.add(a);
    uf.add(b);
    uf.add(c);
    uf.add(d);
    uf.add(e);

    expect(uf.componentCount()).to.equal(5);

    uf.merge(a, b);
    expect(uf.componentCount()).to.equal(4);

    uf.merge(d, e);
    expect(uf.componentCount()).to.equal(3);

    uf.merge(c, d);
    expect(uf.componentCount()).to.equal(2);

    uf.merge(b, c);
    expect(uf.componentCount()).to.equal(1);
  });
});

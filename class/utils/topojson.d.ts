/**
 * Created with JetBrains WebStorm.
 * User: Jerry
 * Date: 4/10/13
 * Time: 10:17 PM
 * To change this template use File | Settings | File Templates.
 */

interface ID3TopologyObjects {
    countries: any;
}

interface ID3Topology {
    objects: ID3TopologyObjects;
}

declare var topojson: any;
declare var topology: ID3Topology;
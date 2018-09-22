import connectors from "./connectors"
import prepositions from "./prepositions"

var consolidated = connectors.concat(prepositions).map((item,index)=>item.toLowerCase())
export default consolidated;
import connectors from "./connectors"
import prepositions from "./prepositions"
import articles from "./articles"
import pronouns from "./pronouns"


var blackList = connectors.concat(prepositions,articles,pronouns).map((item,index)=>item.toLowerCase())
export default blackList;
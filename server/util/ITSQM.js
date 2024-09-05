import FetchAPI from "./FetchAPI.js";
export default class ITSQM {
    #commonParam = {
        "list_info": {
            "row_count": 100,
            "start_index": 0,
            "sort_field": "id",
            "sort_order": "asc",
            "get_total_count": true
        }
    };
    #fetchAPI;
    #hkoRootCertPath;
    #hostName;
    #headers;
    #v3APIPath;
    constructor(itsqmServer, hkoRootCertPath, technicianKey) {
        this.#hostName = "https://" + itsqmServer;
        //let v1API = this.#hostName + "/sdpapi/";
        //let v3API = this.#hostName + "/api/v3";
        this.#v3APIPath = this.#hostName + "/api/v3";
        this.#fetchAPI = new FetchAPI();
        this.#hkoRootCertPath = hkoRootCertPath;        
        this.#headers = { "authtoken": technicianKey };
    }
    getEMSTFTeamMember = async () => {
        let method = "get";
        let params = structuredClone(this.#commonParam);
        let url = this.#v3APIPath + "/users";
        params.list_info["search_criteria"] = [
            {
                "condition": "starts with",
                "field": "jobtitle",                
                "logical_operator": "and",
                "values": ["ITO"]
            },
            {
                "condition":"starts with",
                "field":"jobtitle",
                "logical_operator":"or",
                "values":["SITO"]
            },
        ];
        params["fields_required"] = [
            "email_id",
            "id",
            "name",
            "jobtitle",
            "status"
        ];
      
        let response = await this.#fetchAPI.fetch(
            new URLSearchParams({ input_data: JSON.stringify(params) }),
            method,
            url,
            "json",
            this.#headers,
            this.#hkoRootCertPath);
        return response.users
    }
    query = async query => {
        let data = { "query": query };
      
        let url = this.#v3APIPath + '/reports/execute_query';
        let response = await this.#fetchAPI.fetch(
            new URLSearchParams({ input_data: JSON.stringify(data) }), 
            "post", 
            url,
            "json", 
            this.#headers, 
            this.#hkoRootCertPath);
        return response.execute_query.data;
    }
}
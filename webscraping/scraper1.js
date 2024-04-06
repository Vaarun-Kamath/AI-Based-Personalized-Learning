var QUESt = []
var qs = document.getElementsByClassName("questions-answer-sections")
for (const q of qs) {
    q_obj = {}
    var elems = q.children;

    s= ""
    for (const child of elems) {
        if(child.innerHTML=="")continue;
        if(child.className.includes("mathjax")){
            s+=MathJax.startup.document.getMathItemsWithin(child).map(item => item.math).join();
            continue
        }
        if(child.getElementsByTagName("img").length){
            s+=child.getElementsByTagName("img")[0].src+"\n"
            continue
        }
        s+=child.innerText;

        if (child.tagName === "OL")
            break
    }
    //question
    q_obj["question"] = s

    //options
    var options = {}
    for(i=0;i<q.getElementsByTagName("ol")[0].children.length;i++){
        elems = q.getElementsByTagName("ol")[0].children[i].children
        if(elems.length==0){
            options[i]=q.getElementsByTagName("ol")[0].children[i].innerText;
            continue
        }
        for (const child of elems) {
            if(child.innerHTML=="")continue;
            if(child.className.includes("mathjax")){
                options[i]+=" "+MathJax.startup.document.getMathItemsWithin(child).map(item => item.math).join();
                continue
            }
            if(child.getElementsByTagName("img").length){
                options[i]+=child.getElementsByTagName("img")[0].src+"\n"
                continue
            }
            options[i]+=child.innerText;
    
            if (child.tagName === "OL")
                break
        }
    }
    q_obj["options"] = options;

    //solutions + ans
    ps = q.getElementsByClassName("solutions-sections")[0].getElementsByClassName("ol-list-content")[0].getElementsByTagName("p")
    q_obj["answer"] = ps[0].innerText
    s=""
    for(i=1;i<ps.length;i++){
        if (ps[i].getElementsByTagName("img").length!=0){
            s+= ps[i].getElementsByTagName("img")[0].src+"\n";
        }
        s+=ps[i].innerText
    }
    q_obj["reason"] = s

    QUESt.push(q_obj)
}


document.body.innerText = JSON.stringify(QUESt)
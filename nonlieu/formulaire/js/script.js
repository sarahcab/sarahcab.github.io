//////////////////////////Variables/////////////
window.onload = initialize();

//////////////////////////fonctions/////////////
function initialize(){
	d3.selectAll(".additionnel")
		.style("height","20px")
		.style("overflow","hidden")
		.on("mouseover",function(){
			d3.select(this)
				.transition()
				.duration(500)
				.style("height","")
			d3.select(this)
				.select("legend")
				.html(function(){
					var val = this.attributes.value.value;
					return val;
				})
		})
		.on("mouseout",function(){
			d3.select(this)
				.transition()
				.duration(500)
				.style("height","20px")
			var obj=this;
			setTimeout(function(){
				d3.select(obj)
					.select("legend")
					.html(function(){
						var val = this.attributes.value.value;
						return val + " (Survoler pour dérouler)";
					})
			},500)
		})
		.select("legend")
			.html(function(){
				var val = this.attributes.value.value;
				return val + " (Survoler pour dérouler)";
			})
}

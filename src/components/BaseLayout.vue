<template>
  <header>
		<img id="logo" src="" />
		<div id="burgerContainer" ref="burgerContainer" v-on:click="doToggle">
			<span id="topBurger" ref="topBurger"></span>
			<span></span>
			<span id="bottomBurger" ref="bottomBurger"></span>
		</div>
  </header>
  <div id="navigationContainer">
	<div id="greetingsContainer">
		<span>Hello Christian Shackleton</span>
	</div>
	<nav>
		<div id="subNavList">		
			<div id="closeSubNavContainer" v-on:click="toggleSubMenu(null)"></div>
			<ol>
				<li id="subTitleRow">
					<span> {{ rowTitle }}</span>
					<div id="closeSubNavButton" v-on:click="toggleSubMenu(null)">
						<span></span>
						<span></span>
					</div>
				</li>
				<li class="subNavMenueRow" v-for="item in subNavigation" :key="item.id">
					<span>{{  item.name }}</span>
					<a class="subCheveronWrapper" v-on:click="toggleSubNavMenuRow(item.id)" v-if=" item.children ">
						<font-awesome-icon icon="chevron-down" v-bind:id="'subToggleChev' + item.id" />
					</a>
					<ol v-bind:id="'subNavMenueRow' + item.id" class="nestedNav" v-if=" item.children ">
						<li v-for="children in item.children" :key="children.id">
							<span>{{  children.name }}</span>
						</li>
					</ol>
				</li>
			</ol>	
		</div>	
		<ol id="navList" ref="navList">
			<li v-for="item in navigation" :key="item.id" v-bind:id="'row' + item.id">
				<font-awesome-icon v-bind:icon="item.icon" />
				<span>{{  item.name  }}</span>
				<a v-if="item.children" class="cheveron-wrapper" v-on:click="toggleSubMenu(item.id)">
					<font-awesome-icon icon="chevron-right" />
				</a>				
			</li>			
		</ol>
	</nav>
  </div>
	<div id="crumbsNContentWrap">
		<section id="breadCrumbCont">
			<span>Section ></span>
			<span>Page Title</span>
		</section>
		<main></main>
	</div>
</template>

<script>



export default {
	setup() {
		const state = {
			isOpen: false,
			isSubOpen: false,
			activeRowId:null,
			interval: null,
			fadeInterval: null,
			subInterval: null,
			timeOut: null,
			duration: 450,
			keyframe: 0,
			framerate: 18.75,
			inAction: false,
			activeRow: null
		};
		return {
			state
		};
	},
	methods: {
		doToggle() {
			if(!this.state.inAction){
			
				this.state.isOpen = !this.state.isOpen;
				
				if(this.state.isOpen) this.state.keyframe = 0;
				else this.state.keyframe = this.state.duration / this.state.framerate;
				
				this.action();
			}
			if(this.state.isSubOpen){
				console.log(this.state.isSubOpen);
				this.state.isSubOpen = false;
				
				this.toggleRowActivation("row"+this.state.activeRowId);
				this.subMenuIntAnimation();
			}
		},
		action(){
			var that = this;
			that.state.inAction = true; 
			that.$refs.navList.style.opacity = 0;
			
			//define how long the animation will be. 
			// Below is the timeout set for the animation.
			that.state.timeout = setTimeout(function(){
				clearInterval(that.state.interval);
				
				//manually clean the end of the animation after completion
				if(!that.state.isOpen) {
					//closed
					for(var i=0;i < document.getElementById("burgerContainer").getElementsByTagName("span").length;i++){
						document.getElementById("burgerContainer").getElementsByTagName("span")[i].style.transform = "rotate(0deg)";  
					}	
					
					//clean up the margins on the top & bottom burger
					that.$refs.topBurger.style.marginTop = "-9px";
					that.$refs.bottomBurger.style.marginTop ="9px";						
					
					document.getElementById("navigationContainer").style.width = "0%";	


					
				}else{
					//open
					document.getElementById("navigationContainer").style.width = "100%";
					that.$refs.topBurger.style.transform = "rotate(225)";  
					that.$refs.bottomBurger.style.transform = "rotate(315) !important";  

					that.fadeNavToggle();

					
				}
				that.state.inAction = false;
			}, that.state.duration);
			
			// the interval
			that.state.interval = setInterval(function(){

				//decide which way the linear field is going
				if(that.state.isOpen) that.state.keyframe++;
				else that.state.keyframe--;

				
				// the var goes from 1 -> 100 in where 100 it complete. 
				// Please note this will never get to 100 and needs to manually finish
				var toCompletion = Math.round(( that.state.keyframe/(that.state.duration / that.state.framerate) ) * 100);
				
				/*
				 *		Burgerworks
				 *
				 *		20% of burgers coming together
				 *		60% spinning
				 *		20% opening to an 'X'
				 *
				 */
				switch( true ) {
					case (toCompletion < 20):
						/*
						 *		The styling on the top & bottom burger margins are -9px and 9px respectfully
						 *		All three burgers are centered horizontally within it's parent
						 *		Below is the linear eq for moving between 0 and 20% completion 
						  *	and ranging the 9 pixels throughout the duration
						*/
						var y = Math.round(((-9/17)*toCompletion) + 9); //17 to guarantee it completes rather than -9/20
						

						that.$refs.topBurger.style.marginTop = -y+"px";
						that.$refs.bottomBurger.style.marginTop = y+"px";
						break;
					case (toCompletion >= 20 && toCompletion < 80):
						// flipping burgers here
						var burgers = that.$refs.burgerContainer;
						var degree = (toCompletion > 75)  ? 225 :  Math.round(((15/4) * toCompletion) - 75); 
						
						//let's rotate each burger to the proper degree
						for(var i=0;i < burgers.getElementsByTagName("span").length;i++){
							burgers.getElementsByTagName("span")[i].style.transform = "rotate("+ degree +"deg)";  
						}
						break;
					case (toCompletion >= 80):
						// 225deg to 315 for the bottom burger to complete the "X"
						var degreeBottomBurger = (toCompletion > 95)  ? 315 : Math.round(((9/2) * toCompletion) - 135); 
						that.$refs.bottomBurger.style.transform = "rotate("+ degreeBottomBurger +"deg)";  
						break;
						
				}
				
				//Navigation Slide
				document.getElementById("navigationContainer").style.width = toCompletion+"%";
				
				
			}, this.state.framerate);			
		},
		fadeNavToggle(){
			var that = this;
			var intrvl = 0;
			that.state.fadeInterval = setInterval(function(){
				// let's stop the interval if the value is 1
				if( that.$refs.navList.style.opacity >= 1){
					clearInterval(that.state.fadeInterval);
				}
				intrvl = intrvl + 0.10
				that.$refs.navList.style.opacity = intrvl;
			}, 30);
		},
		setRowTitle(title){
			this.$data.rowTitle = title;
		},
		subMenuIntAnimation(){
			this.toggleClass(document.getElementById("subNavList"), "active");
		
			/*
			
			~ I'm leaving this in here to show refactoring animation from JavaScript to CSS ~
			
			
			var that = this;
			var intvl = 0;
			var subNavList = document.getElementById('subNavList');
			
			that.state.subInterval = setInterval(function(){
				
				if(!that.state.isSubOpen){
					//the sub nav is open and needs to close
					subNavList.style.right =  -intvl + "vw";	
				}else{
					//the sub nav is not open and needs to open
					subNavList.style.right =  (intvl - 100) + "vw";
				}
				if(intvl == 100) {
					clearInterval(that.state.subInterval);
				}
				intvl = intvl + 10;
			}, 30); */		
		},
		toggleSubMenu(id){
			//this toggles the sub navigation			
			if( id === null){
				id = this.state.activeRowId;
			}
			this.state.activeRowId = id;

			//styling
			this.toggleRowActivation("row"+id);
			this.setRowTitle(this.$data.navigation[id].name);
			console.log(this.$data.navigation[id].children);
			
			//this places the sub nav data in the right place for the proper content to be presented
			this.$data.subNavigation = this.$data.navigation[id].children;
			this.subMenuIntAnimation();
			

		},
		toggleRowActivation(parentLi){
			if(!this.activeRow){
				//row needs to be activated
				var row = document.getElementById(parentLi);
				row.className = "active";
				this.state.isSubOpen = true;
				this.activeRow = row;
			}else{
				//row needs to be deactivated
				this.activeRow.className = "";
				this.state.isSubOpen = false;
				this.activeRow = null;
			}
			
		},
		hasClass(elm, className){
			return new RegExp(' ' + className + ' ').test(' ' + elm.className + ' ');
		},
		addClass(elm, className){
			if (!this.hasClass(elm, className)) {
				elm.className += ' ' + className;
			}		
		},
		removeClass(elm, className){
			var newClass = ' ' + elm.className.replace( /[\t\r\n]/g, ' ') + ' ';
			if (this.hasClass(elm, className)) {
				while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
					newClass = newClass.replace(' ' + className + ' ', ' ');
				}
				elm.className = newClass.replace(/^\s+|\s+$/g, '');
			}	
		},
		toggleClass(elm, className){
			var newClass = ' ' + elm.className.replace( /[\t\r\n]/g, ' ' ) + ' ';
			if (this.hasClass(elm, className)) {
				while (newClass.indexOf(' ' + className + ' ') >= 0 ) {
					newClass = newClass.replace( ' ' + className + ' ' , ' ' );
				}
				elm.className = newClass.replace(/^\s+|\s+$/g, '');
			} else {
				elm.className += ' ' + className;
			}		
		},
		toggleSubNavMenuRow(id){
			//toggles the sub sub menu
			this.toggleClass(document.getElementById('subNavMenueRow'+id), "open");
			
			if (document.getElementById('subToggleChev'+id).className.baseVal != "twist") document.getElementById('subToggleChev'+id).className.baseVal = "twist";
			else document.getElementById('subToggleChev'+id).className.baseVal = "";
		}
	},
	components: {
	},
	data () {
		return {
			navigation: [
				{id: 0, name:"My Schedule & Bidding",  url:"/location", icon:"calendar-alt", children: [
					{name: "Reporting",  url:"/location", id:9, children: [
							{name:"I-21 Injury Reporting", url:"/location", id:22},
							{name:"ASAP Reporting", url:"/location", id:23},
							{name:"General ASP Information", url:"/location", id:24},
							{name:"Flight Attendant Incident Report", url:"/location", id:25}
					]},
					{name: "Agriculture and Customs",  id:10, url:"/location", children: [
							{name:"test 1",  url:"/location", id:26},
							{name:"test 2",  url:"/location", id:27},
							{name:"test 3", url:"/location", id:28}
					]},
					{name: "Known Crewmember",  url:"/location", id:11},
					{name: "Product Safety Data Search",  url:"/location", id:12},
				]},
				{id: 1, name:"Safety",  url:"/location", icon:"hard-hat", children: [
					{name: "Reporting",  url:"/location", id:13, children: [
							{name:"I-21 Injury Reporting", url:"/location", id:29},
							{name:"ASAP Reporting", url:"/location", id:30},
							{name:"General ASP Information", url:"/location", id:31},
							{name:"Flight Attendant Incident Report", url:"/location", id:32}
					]},
					{name: "Agriculture and Customs",  url:"/location", id:14, children: [
							{name:"test 1",  url:"/location", id:33},
							{name:"test 2",  url:"/location", id:34},
							{name:"test 3", url:"/location", id:35}
					]},
					{name: "Known Crewmember",  url:"/location", id:15},
				]},
				{id: 2, name:"Training",  url:"/location", icon:"chalkboard-teacher"},
				{id: 3, name:"Administration",  url:"/location", icon:"users-cog", children: [
					{name: "Reporting",  url:"/location", id:16, children: [
							{name:"I-21 Injury Reporting", url:"/location", id:36},
							{name:"ASAP Reporting", url:"/location", id:37},
							{name:"General ASP Information", url:"/location", id:38},
							{name:"Flight Attendant Incident Report", url:"/location", id:39}
					]},
					{name: "Agriculture and Customs",  url:"/location", id:17, children: [
							{name:"test 1",  url:"/location", id:40},
							{name:"test 2",  url:"/location", id:41},
							{name:"test 3", url:"/location", id:42}
					]},
					{name: "Known Crewmember",  url:"/location", id:18},
				]},
				{id: 4, name:"Catering & Brand",  url:"/location", icon:"hand-holding-water", children: [
					{name: "Reporting",  url:"/location", id:19, children: [
							{name:"I-21 Injury Reporting", url:"/location", id:43},
							{name:"ASAP Reporting", url:"/location", id:44},
							{name:"General ASP Information", url:"/location", id:45},
							{name:"Flight Attendant Incident Report", url:"/location", id:46}
					]},
					{name: "Agriculture and Customs",  url:"/location", id:20, children: [
							{name:"test 1",  url:"/location", id:47},
							{name:"test 2",  url:"/location", id:48},
							{name:"test 3", url:"/location", id:49}
					]},
					{name: "Known Crewmember",  url:"/location", id:21},
				]},
				{id: 5, name:"Hotels",  url:"/location", icon:"luggage-cart"},
				{id: 6, name:"My Base",  url:"/location", icon:"house-user"},
				{id: 7, name:"Recognition",  url:"/location", icon:"search"},
				{id: 8, name:"Protection",  url:"/location", icon:"shield-alt"},
			],
			rowTitle: null,
			subNavigation: []
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only 
<style scoped>

</style>
-->
<!-- Add lang="scss" to pull global scss in to component
<style lang="scss">

</style>
-->
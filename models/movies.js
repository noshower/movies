var mongoose =require('mongoose');
var MovieSchema=new mongoose.Schema({
	doctor:String,
	title:String,
	language:String,
	country:String,
	summary:String,
	flash:String,
	poster:String,
	year:Number,
	meta:{
		createAt:{
			type:Date,
			default:Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}
});
//在保存之前调用这个函数，如果数据是新添加的，则创建时间和更新时间都一样。否则，只更新更新时间
MovieSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt=this.meta.updateAt=Date.now();
	}else{
		this.meta.updateAt=Date.now();
	}
	next();
});
//添加静态方法
MovieSchema.statics={
	//取出所有数据，并按更新时间排序
	fetch:function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	//取出一个数据
	findById:function(id,cb){
		return this.findOne({_id:id}).exec(cb);
	}
}

var Movie=mongoose.model('Movie',MovieSchema);
module.exports=Movie;
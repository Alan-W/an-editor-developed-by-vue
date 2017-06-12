// 公用函数调用
 export default {
 	// 首字母大写
 	firstUpperCase (str) {
 		return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());
 	},

 	// 弧度制转化为角度制
    covretRadiansToAngle (radian) {
		let angle = radian * 180 / Math.PI;
		return angle;
	},

	// 角度值转化为弧度制
	covertAngleToRadians (angle) {
		console.log('传入的值是： ----- ', angle);
		let radian = angle * Math.PI / 180;
		return radian; 
	}

 }
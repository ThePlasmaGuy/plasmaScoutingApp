// Generated by Haxe 3.4.7
(function ($global) { "use strict";
var $estr = function() { return js_Boot.__string_rec(this,''); };
function $extend(from, fields) {
	function Inherit() {} Inherit.prototype = from; var proto = new Inherit();
	for (var name in fields) proto[name] = fields[name];
	if( fields.toString !== Object.prototype.toString ) proto.toString = fields.toString;
	return proto;
}
var HxOverrides = function() { };
HxOverrides.__name__ = true;
HxOverrides.dateStr = function(date) {
	var m = date.getMonth() + 1;
	var d = date.getDate();
	var h = date.getHours();
	var mi = date.getMinutes();
	var s = date.getSeconds();
	return date.getFullYear() + "-" + (m < 10 ? "0" + m : "" + m) + "-" + (d < 10 ? "0" + d : "" + d) + " " + (h < 10 ? "0" + h : "" + h) + ":" + (mi < 10 ? "0" + mi : "" + mi) + ":" + (s < 10 ? "0" + s : "" + s);
};
HxOverrides.strDate = function(s) {
	var _g = s.length;
	switch(_g) {
	case 8:
		var k = s.split(":");
		var d = new Date();
		d["setTime"](0);
		d["setUTCHours"](k[0]);
		d["setUTCMinutes"](k[1]);
		d["setUTCSeconds"](k[2]);
		return d;
	case 10:
		var k1 = s.split("-");
		return new Date(k1[0],k1[1] - 1,k1[2],0,0,0);
	case 19:
		var k2 = s.split(" ");
		var y = k2[0].split("-");
		var t = k2[1].split(":");
		return new Date(y[0],y[1] - 1,y[2],t[0],t[1],t[2]);
	default:
		throw new js__$Boot_HaxeError("Invalid date format : " + s);
	}
};
HxOverrides.cca = function(s,index) {
	var x = s.charCodeAt(index);
	if(x != x) {
		return undefined;
	}
	return x;
};
HxOverrides.iter = function(a) {
	return { cur : 0, arr : a, hasNext : function() {
		return this.cur < this.arr.length;
	}, next : function() {
		return this.arr[this.cur++];
	}};
};
var Main = function() { };
Main.__name__ = true;
Main.main = function() {
	var a = js_node_Fs.readFileSync("inputs.json",{ encoding : "utf8"});
	var b = haxe_format_JsonPrinter.print(a);
	console.log(b);
};
Math.__name__ = true;
var Reflect = function() { };
Reflect.__name__ = true;
Reflect.field = function(o,field) {
	try {
		return o[field];
	} catch( e ) {
		return null;
	}
};
Reflect.fields = function(o) {
	var a = [];
	if(o != null) {
		var hasOwnProperty = Object.prototype.hasOwnProperty;
		for( var f in o ) {
		if(f != "__id__" && f != "hx__closures__" && hasOwnProperty.call(o,f)) {
			a.push(f);
		}
		}
	}
	return a;
};
Reflect.isFunction = function(f) {
	if(typeof(f) == "function") {
		return !(f.__name__ || f.__ename__);
	} else {
		return false;
	}
};
var Std = function() { };
Std.__name__ = true;
Std.string = function(s) {
	return js_Boot.__string_rec(s,"");
};
var StringBuf = function() {
	this.b = "";
};
StringBuf.__name__ = true;
StringBuf.prototype = {
	__class__: StringBuf
};
var StringTools = function() { };
StringTools.__name__ = true;
StringTools.lpad = function(s,c,l) {
	if(c.length <= 0) {
		return s;
	}
	while(s.length < l) s = c + s;
	return s;
};
var ValueType = { __ename__ : true, __constructs__ : ["TNull","TInt","TFloat","TBool","TObject","TFunction","TClass","TEnum","TUnknown"] };
ValueType.TNull = ["TNull",0];
ValueType.TNull.toString = $estr;
ValueType.TNull.__enum__ = ValueType;
ValueType.TInt = ["TInt",1];
ValueType.TInt.toString = $estr;
ValueType.TInt.__enum__ = ValueType;
ValueType.TFloat = ["TFloat",2];
ValueType.TFloat.toString = $estr;
ValueType.TFloat.__enum__ = ValueType;
ValueType.TBool = ["TBool",3];
ValueType.TBool.toString = $estr;
ValueType.TBool.__enum__ = ValueType;
ValueType.TObject = ["TObject",4];
ValueType.TObject.toString = $estr;
ValueType.TObject.__enum__ = ValueType;
ValueType.TFunction = ["TFunction",5];
ValueType.TFunction.toString = $estr;
ValueType.TFunction.__enum__ = ValueType;
ValueType.TClass = function(c) { var $x = ["TClass",6,c]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TEnum = function(e) { var $x = ["TEnum",7,e]; $x.__enum__ = ValueType; $x.toString = $estr; return $x; };
ValueType.TUnknown = ["TUnknown",8];
ValueType.TUnknown.toString = $estr;
ValueType.TUnknown.__enum__ = ValueType;
var Type = function() { };
Type.__name__ = true;
Type["typeof"] = function(v) {
	var _g = typeof(v);
	switch(_g) {
	case "boolean":
		return ValueType.TBool;
	case "function":
		if(v.__name__ || v.__ename__) {
			return ValueType.TObject;
		}
		return ValueType.TFunction;
	case "number":
		if(Math.ceil(v) == v % 2147483648.0) {
			return ValueType.TInt;
		}
		return ValueType.TFloat;
	case "object":
		if(v == null) {
			return ValueType.TNull;
		}
		var e = v.__enum__;
		if(e != null) {
			return ValueType.TEnum(e);
		}
		var c = js_Boot.getClass(v);
		if(c != null) {
			return ValueType.TClass(c);
		}
		return ValueType.TObject;
	case "string":
		return ValueType.TClass(String);
	case "undefined":
		return ValueType.TNull;
	default:
		return ValueType.TUnknown;
	}
};
var haxe_IMap = function() { };
haxe_IMap.__name__ = true;
var haxe_ds_StringMap = function() {
	this.h = { };
};
haxe_ds_StringMap.__name__ = true;
haxe_ds_StringMap.__interfaces__ = [haxe_IMap];
haxe_ds_StringMap.prototype = {
	getReserved: function(key) {
		if(this.rh == null) {
			return null;
		} else {
			return this.rh["$" + key];
		}
	}
	,keys: function() {
		return HxOverrides.iter(this.arrayKeys());
	}
	,arrayKeys: function() {
		var out = [];
		for( var key in this.h ) {
		if(this.h.hasOwnProperty(key)) {
			out.push(key);
		}
		}
		if(this.rh != null) {
			for( var key in this.rh ) {
			if(key.charCodeAt(0) == 36) {
				out.push(key.substr(1));
			}
			}
		}
		return out;
	}
	,__class__: haxe_ds_StringMap
};
var haxe_format_JsonPrinter = function(replacer,space) {
	this.replacer = replacer;
	this.indent = space;
	this.pretty = space != null;
	this.nind = 0;
	this.buf = new StringBuf();
};
haxe_format_JsonPrinter.__name__ = true;
haxe_format_JsonPrinter.print = function(o,replacer,space) {
	var printer = new haxe_format_JsonPrinter(replacer,space);
	printer.write("",o);
	return printer.buf.b;
};
haxe_format_JsonPrinter.prototype = {
	write: function(k,v) {
		if(this.replacer != null) {
			v = this.replacer(k,v);
		}
		var _g = Type["typeof"](v);
		switch(_g[1]) {
		case 0:
			this.buf.b += "null";
			break;
		case 1:
			this.buf.b += Std.string(v);
			break;
		case 2:
			var v1 = isFinite(v) ? v : "null";
			this.buf.b += Std.string(v1);
			break;
		case 3:
			this.buf.b += Std.string(v);
			break;
		case 4:
			this.fieldsString(v,Reflect.fields(v));
			break;
		case 5:
			this.buf.b += "\"<fun>\"";
			break;
		case 6:
			var c = _g[2];
			if(c == String) {
				this.quote(v);
			} else if(c == Array) {
				var v2 = v;
				this.buf.b += "[";
				var len = v2.length;
				var last = len - 1;
				var _g1 = 0;
				var _g2 = len;
				while(_g1 < _g2) {
					var i = _g1++;
					if(i > 0) {
						this.buf.b += ",";
					} else {
						this.nind++;
					}
					if(this.pretty) {
						this.buf.b += "\n";
					}
					if(this.pretty) {
						var v3 = StringTools.lpad("",this.indent,this.nind * this.indent.length);
						this.buf.b += Std.string(v3);
					}
					this.write(i,v2[i]);
					if(i == last) {
						this.nind--;
						if(this.pretty) {
							this.buf.b += "\n";
						}
						if(this.pretty) {
							var v4 = StringTools.lpad("",this.indent,this.nind * this.indent.length);
							this.buf.b += Std.string(v4);
						}
					}
				}
				this.buf.b += "]";
			} else if(c == haxe_ds_StringMap) {
				var v5 = v;
				var o = { };
				var k1 = v5.keys();
				while(k1.hasNext()) {
					var k2 = k1.next();
					o[k2] = __map_reserved[k2] != null ? v5.getReserved(k2) : v5.h[k2];
				}
				this.fieldsString(o,Reflect.fields(o));
			} else if(c == Date) {
				var v6 = v;
				this.quote(HxOverrides.dateStr(v6));
			} else {
				this.fieldsString(v,Reflect.fields(v));
			}
			break;
		case 7:
			var i1 = v[1];
			this.buf.b += Std.string(i1);
			break;
		case 8:
			this.buf.b += "\"???\"";
			break;
		}
	}
	,fieldsString: function(v,fields) {
		this.buf.b += "{";
		var len = fields.length;
		var last = len - 1;
		var first = true;
		var _g1 = 0;
		var _g = len;
		while(_g1 < _g) {
			var i = _g1++;
			var f = fields[i];
			var value = Reflect.field(v,f);
			if(Reflect.isFunction(value)) {
				continue;
			}
			if(first) {
				this.nind++;
				first = false;
			} else {
				this.buf.b += ",";
			}
			if(this.pretty) {
				this.buf.b += "\n";
			}
			if(this.pretty) {
				var v1 = StringTools.lpad("",this.indent,this.nind * this.indent.length);
				this.buf.b += Std.string(v1);
			}
			this.quote(f);
			this.buf.b += ":";
			if(this.pretty) {
				this.buf.b += " ";
			}
			this.write(f,value);
			if(i == last) {
				this.nind--;
				if(this.pretty) {
					this.buf.b += "\n";
				}
				if(this.pretty) {
					var v2 = StringTools.lpad("",this.indent,this.nind * this.indent.length);
					this.buf.b += Std.string(v2);
				}
			}
		}
		this.buf.b += "}";
	}
	,quote: function(s) {
		this.buf.b += "\"";
		var i = 0;
		while(true) {
			var c = s.charCodeAt(i++);
			if(c != c) {
				break;
			}
			switch(c) {
			case 8:
				this.buf.b += "\\b";
				break;
			case 9:
				this.buf.b += "\\t";
				break;
			case 10:
				this.buf.b += "\\n";
				break;
			case 12:
				this.buf.b += "\\f";
				break;
			case 13:
				this.buf.b += "\\r";
				break;
			case 34:
				this.buf.b += "\\\"";
				break;
			case 92:
				this.buf.b += "\\\\";
				break;
			default:
				this.buf.b += String.fromCharCode(c);
			}
		}
		this.buf.b += "\"";
	}
	,__class__: haxe_format_JsonPrinter
};
var haxe_io_Bytes = function(data) {
	this.length = data.byteLength;
	this.b = new Uint8Array(data);
	this.b.bufferValue = data;
	data.hxBytes = this;
	data.bytes = this.b;
};
haxe_io_Bytes.__name__ = true;
haxe_io_Bytes.alloc = function(length) {
	return new haxe_io_Bytes(new ArrayBuffer(length));
};
haxe_io_Bytes.ofString = function(s) {
	var a = [];
	var i = 0;
	while(i < s.length) {
		var c = s.charCodeAt(i++);
		if(55296 <= c && c <= 56319) {
			c = c - 55232 << 10 | s.charCodeAt(i++) & 1023;
		}
		if(c <= 127) {
			a.push(c);
		} else if(c <= 2047) {
			a.push(192 | c >> 6);
			a.push(128 | c & 63);
		} else if(c <= 65535) {
			a.push(224 | c >> 12);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		} else {
			a.push(240 | c >> 18);
			a.push(128 | c >> 12 & 63);
			a.push(128 | c >> 6 & 63);
			a.push(128 | c & 63);
		}
	}
	return new haxe_io_Bytes(new Uint8Array(a).buffer);
};
haxe_io_Bytes.ofData = function(b) {
	var hb = b.hxBytes;
	if(hb != null) {
		return hb;
	}
	return new haxe_io_Bytes(b);
};
haxe_io_Bytes.fastGet = function(b,pos) {
	return b.bytes[pos];
};
haxe_io_Bytes.prototype = {
	__class__: haxe_io_Bytes
};
var haxe_io_Eof = function() {
};
haxe_io_Eof.__name__ = true;
haxe_io_Eof.prototype = {
	toString: function() {
		return "Eof";
	}
	,__class__: haxe_io_Eof
};
var haxe_io_Error = { __ename__ : true, __constructs__ : ["Blocked","Overflow","OutsideBounds","Custom"] };
haxe_io_Error.Blocked = ["Blocked",0];
haxe_io_Error.Blocked.toString = $estr;
haxe_io_Error.Blocked.__enum__ = haxe_io_Error;
haxe_io_Error.Overflow = ["Overflow",1];
haxe_io_Error.Overflow.toString = $estr;
haxe_io_Error.Overflow.__enum__ = haxe_io_Error;
haxe_io_Error.OutsideBounds = ["OutsideBounds",2];
haxe_io_Error.OutsideBounds.toString = $estr;
haxe_io_Error.OutsideBounds.__enum__ = haxe_io_Error;
haxe_io_Error.Custom = function(e) { var $x = ["Custom",3,e]; $x.__enum__ = haxe_io_Error; $x.toString = $estr; return $x; };
var haxe_io_Input = function() { };
haxe_io_Input.__name__ = true;
var haxe_io_Output = function() { };
haxe_io_Output.__name__ = true;
var js__$Boot_HaxeError = function(val) {
	Error.call(this);
	this.val = val;
	this.message = String(val);
	if(Error.captureStackTrace) {
		Error.captureStackTrace(this,js__$Boot_HaxeError);
	}
};
js__$Boot_HaxeError.__name__ = true;
js__$Boot_HaxeError.wrap = function(val) {
	if((val instanceof Error)) {
		return val;
	} else {
		return new js__$Boot_HaxeError(val);
	}
};
js__$Boot_HaxeError.__super__ = Error;
js__$Boot_HaxeError.prototype = $extend(Error.prototype,{
	__class__: js__$Boot_HaxeError
});
var js_Boot = function() { };
js_Boot.__name__ = true;
js_Boot.getClass = function(o) {
	if((o instanceof Array) && o.__enum__ == null) {
		return Array;
	} else {
		var cl = o.__class__;
		if(cl != null) {
			return cl;
		}
		var name = js_Boot.__nativeClassName(o);
		if(name != null) {
			return js_Boot.__resolveNativeClass(name);
		}
		return null;
	}
};
js_Boot.__string_rec = function(o,s) {
	if(o == null) {
		return "null";
	}
	if(s.length >= 5) {
		return "<...>";
	}
	var t = typeof(o);
	if(t == "function" && (o.__name__ || o.__ename__)) {
		t = "object";
	}
	switch(t) {
	case "function":
		return "<function>";
	case "object":
		if(o instanceof Array) {
			if(o.__enum__) {
				if(o.length == 2) {
					return o[0];
				}
				var str = o[0] + "(";
				s += "\t";
				var _g1 = 2;
				var _g = o.length;
				while(_g1 < _g) {
					var i = _g1++;
					if(i != 2) {
						str += "," + js_Boot.__string_rec(o[i],s);
					} else {
						str += js_Boot.__string_rec(o[i],s);
					}
				}
				return str + ")";
			}
			var l = o.length;
			var i1;
			var str1 = "[";
			s += "\t";
			var _g11 = 0;
			var _g2 = l;
			while(_g11 < _g2) {
				var i2 = _g11++;
				str1 += (i2 > 0 ? "," : "") + js_Boot.__string_rec(o[i2],s);
			}
			str1 += "]";
			return str1;
		}
		var tostr;
		try {
			tostr = o.toString;
		} catch( e ) {
			return "???";
		}
		if(tostr != null && tostr != Object.toString && typeof(tostr) == "function") {
			var s2 = o.toString();
			if(s2 != "[object Object]") {
				return s2;
			}
		}
		var k = null;
		var str2 = "{\n";
		s += "\t";
		var hasp = o.hasOwnProperty != null;
		for( var k in o ) {
		if(hasp && !o.hasOwnProperty(k)) {
			continue;
		}
		if(k == "prototype" || k == "__class__" || k == "__super__" || k == "__interfaces__" || k == "__properties__") {
			continue;
		}
		if(str2.length != 2) {
			str2 += ", \n";
		}
		str2 += s + k + " : " + js_Boot.__string_rec(o[k],s);
		}
		s = s.substring(1);
		str2 += "\n" + s + "}";
		return str2;
	case "string":
		return o;
	default:
		return String(o);
	}
};
js_Boot.__nativeClassName = function(o) {
	var name = js_Boot.__toStr.call(o).slice(8,-1);
	if(name == "Object" || name == "Function" || name == "Math" || name == "JSON") {
		return null;
	}
	return name;
};
js_Boot.__resolveNativeClass = function(name) {
	return $global[name];
};
var js_node_Fs = require("fs");
var js_node_buffer_Buffer = require("buffer").Buffer;
var sys_io_FileInput = function(fd) {
	this.fd = fd;
	this.pos = 0;
};
sys_io_FileInput.__name__ = true;
sys_io_FileInput.__super__ = haxe_io_Input;
sys_io_FileInput.prototype = $extend(haxe_io_Input.prototype,{
	readByte: function() {
		var buf = new js_node_buffer_Buffer(1);
		var bytesRead;
		try {
			bytesRead = js_node_Fs.readSync(this.fd,buf,0,1,this.pos);
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			if(e.code == "EOF") {
				throw new js__$Boot_HaxeError(new haxe_io_Eof());
			} else {
				throw new js__$Boot_HaxeError(haxe_io_Error.Custom(e));
			}
		}
		if(bytesRead == 0) {
			throw new js__$Boot_HaxeError(new haxe_io_Eof());
		}
		this.pos++;
		return buf[0];
	}
	,readBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		var bytesRead;
		try {
			bytesRead = js_node_Fs.readSync(this.fd,buf,pos,len,this.pos);
		} catch( e ) {
			if (e instanceof js__$Boot_HaxeError) e = e.val;
			if(e.code == "EOF") {
				throw new js__$Boot_HaxeError(new haxe_io_Eof());
			} else {
				throw new js__$Boot_HaxeError(haxe_io_Error.Custom(e));
			}
		}
		if(bytesRead == 0) {
			throw new js__$Boot_HaxeError(new haxe_io_Eof());
		}
		this.pos += bytesRead;
		return bytesRead;
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,seek: function(p,pos) {
		switch(pos[1]) {
		case 0:
			this.pos = p;
			break;
		case 1:
			this.pos += p;
			break;
		case 2:
			this.pos = js_node_Fs.fstatSync(this.fd).size + p;
			break;
		}
	}
	,tell: function() {
		return this.pos;
	}
	,eof: function() {
		return this.pos >= js_node_Fs.fstatSync(this.fd).size;
	}
	,__class__: sys_io_FileInput
});
var sys_io_FileOutput = function(fd) {
	this.fd = fd;
	this.pos = 0;
};
sys_io_FileOutput.__name__ = true;
sys_io_FileOutput.__super__ = haxe_io_Output;
sys_io_FileOutput.prototype = $extend(haxe_io_Output.prototype,{
	writeByte: function(b) {
		var buf = new js_node_buffer_Buffer(1);
		buf[0] = b;
		js_node_Fs.writeSync(this.fd,buf,0,1,this.pos);
		this.pos++;
	}
	,writeBytes: function(s,pos,len) {
		var data = s.b;
		var buf = js_node_buffer_Buffer.from(data.buffer,data.byteOffset,s.length);
		var wrote = js_node_Fs.writeSync(this.fd,buf,pos,len,this.pos);
		this.pos += wrote;
		return wrote;
	}
	,close: function() {
		js_node_Fs.closeSync(this.fd);
	}
	,seek: function(p,pos) {
		switch(pos[1]) {
		case 0:
			this.pos = p;
			break;
		case 1:
			this.pos += p;
			break;
		case 2:
			this.pos = js_node_Fs.fstatSync(this.fd).size + p;
			break;
		}
	}
	,tell: function() {
		return this.pos;
	}
	,__class__: sys_io_FileOutput
});
var sys_io_FileSeek = { __ename__ : true, __constructs__ : ["SeekBegin","SeekCur","SeekEnd"] };
sys_io_FileSeek.SeekBegin = ["SeekBegin",0];
sys_io_FileSeek.SeekBegin.toString = $estr;
sys_io_FileSeek.SeekBegin.__enum__ = sys_io_FileSeek;
sys_io_FileSeek.SeekCur = ["SeekCur",1];
sys_io_FileSeek.SeekCur.toString = $estr;
sys_io_FileSeek.SeekCur.__enum__ = sys_io_FileSeek;
sys_io_FileSeek.SeekEnd = ["SeekEnd",2];
sys_io_FileSeek.SeekEnd.toString = $estr;
sys_io_FileSeek.SeekEnd.__enum__ = sys_io_FileSeek;
String.prototype.__class__ = String;
String.__name__ = true;
Array.__name__ = true;
Date.prototype.__class__ = Date;
Date.__name__ = ["Date"];
var __map_reserved = {};
js_Boot.__toStr = ({ }).toString;
Main.main();
})(typeof window != "undefined" ? window : typeof global != "undefined" ? global : typeof self != "undefined" ? self : this);

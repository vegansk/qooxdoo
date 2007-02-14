
qx.Clazz.define("qxunit.Mixin", { statics : {
	
	testMixinBasic: function() {
		qx.Mixin.define("qxunit.MMix1", {
			statics: {
				foo: function() { return "foo"; }
			},
			members: {
				bar: function() { return "bar"; }
			},
			properties: {
				color: { compat: true }
			}
		});

		qx.Mixin.define("qxunit.MMix2", {
			members: {
				bar: function() { return "bar"; }
			}
		});

		qx.Clazz.define("qxunit.Mix", {
			extend: Object,
			include: qxunit.MMix1,
			construct: function() {}
		});
		assertEquals("foo", qxunit.Mix.foo());
		assertEquals("bar", new qxunit.Mix().bar());
		var mix = new qxunit.Mix();
		mix.setColor("red");
		assertEquals("red", mix.getColor());		
		
		var error = false;
		try {
			qx.Clazz.define("qxunit.Mix1", {
				extend: Object,
				include: [qxunit.MMix1, qxunit.MMix2],
				construct: function() {}
			});			
		} catch (e) {
			error = true;
		}
		assertTrue("MMix1 and MMix2 are incompatible.", error);

		var error = false;
		try {
			qx.Clazz.define("qxunit.Mix2", {
				extend: Object,
				include: qxunit.MMix1,
				construct: function() {},
				members: {
					bar: function() { return "bar"; }
				}
			});			
		} catch (e) {
			error = true;
		}
		assertTrue("Mix and MMix1 have incompatible members.", error);

		var error = false;
		try {
			qx.Clazz.define("qxunit.Mix3", {
				extend: Object,
				include: qxunit.MMix1,
				construct: function() {},
				statics: {
					foo: function() { return "foo"; }
				}
			});			
		} catch (e) {
			error = true;
		}
		assertTrue("Mix and MMix1 have incompatible statics.", error);

		var error = false;
		try {
			qx.Clazz.define("qxunit.Mix4", {
				extend: Object,
				include: qxunit.MMix1,
				construct: function() {},
				properties: {
					color: { compat: true }
				}
			});			
		} catch (e) {
			error = true;
		}
		assertTrue("Mix and MMix1 have incompatible properties.", error);

	},
	
	
	testInclude: function() {
		
		qx.Mixin.define("qxunit.MLogger", {
			members: {
				log: function(msg) {
					return msg;
				}
			}
		});
		
		// normal usage
		qx.Clazz.define("qxunit.UseLog1", {
			extend: Object,
			construct: function() {}
		});
		
		qx.Clazz.include(qxunit.UseLog1, qxunit.MLogger);		
		assertEquals("Juhu", new qxunit.UseLog1().log("Juhu"));
		
		// not allowed to overwrite!
		qx.Clazz.define("qxunit.UseLog2", {
			extend: Object,
			construct: function() {},
			members: {
				log: function() { return "foo"; }
			}
		});
		
		var error = true;
		try {
			qx.Clazz.include(qxunit.UseLog2, qxunit.MLogger);
		} catch (e) {
			error = e;
		}
		assertEquals(
			new Error("Overwriting the member 'log' is not allowed!").toString(),
			error.toString()
		);
		
		// allowed to overwrite!
		qx.Clazz.define("qxunit.UseLog3", {
			extend: Object,
			construct: function() {},
			members: {
				log: function() { return "foo"; }
			}
		});
		
		assertEquals("foo", new qxunit.UseLog3().log("Juhu"));		
		qx.Clazz.patch(qxunit.UseLog3, qxunit.MLogger);
		assertEquals("Juhu", new qxunit.UseLog3().log("Juhu"));		
	}	
	
	
}});
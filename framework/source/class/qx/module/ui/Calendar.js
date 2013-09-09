/**
 * @require(qx.module.Template)
 * @require(qx.module.event.Native)
 */
qx.Bootstrap.define("qx.module.ui.Calendar", {
  extend : qx.module.ui.Widget,

  statics : {
    _templates : {
      controls : "<tr>" +
                   "<td colspan='1'><button class='qx-calendar-prev' title='Previous Month'>&lt;</button></td>" +
                   "<td colspan='5'>{{month}} {{year}}</td>" +
                   "<td colspan='1' title='Next Month' class='qx-calendar-next'><button>&gt;</button></td>" +
                 "</tr>",
      dayRow : "<tr>" +
                 "{{#row}}<td>{{.}}</td>{{/row}}" +
               "</tr>",
      row : "<tr>" +
              "{{#row}}<td class='{{cssClass}}'><button class='qx-calendar-day' value='{{date}}'>{{day}}</button></td>{{/row}}" +
            "</tr>",
      table : "<table><thead>{{{thead}}}</thead><tbody>{{{tbody}}}</tbody></table>",

      monthNames : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      dayNames : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    }
  },


  construct : function(selector, context) {
    this.base(arguments, selector, context);

    this.forEach(function(calendar) {
      var calendar = qxWeb(calendar);

      this.showValue(new Date());

      if (!calendar.hasClass("qx-calendar")) {
        calendar.addClass("qx-calendar");
      }

    }.bind(this));
  },


  members : {
    render : function() {
      this.showValue(this.getProperty("shownValue"));
    },


    setValue : function(value) {
      this.setProperty("value", value);
      this.showValue(value);
    },


    getValue : function() {
      return this.getProperty("value");
    },


    showValue : function(value) {
      this.setProperty("shownValue", value);

      this.setHtml(this._getTable(value));

      this.find(".qx-calendar-prev").on("click", function() {
        var shownValue = this.getProperty("shownValue");
        this.showValue(new Date(shownValue.getFullYear(), shownValue.getMonth() - 1))
      }, this);

      this.find(".qx-calendar-next").on("click", function() {
        var shownValue = this.getProperty("shownValue");
        this.showValue(new Date(shownValue.getFullYear(), shownValue.getMonth() + 1))
      }, this);

      this.find(".qx-calendar-day").on("click", function(e) {
        var day = qxWeb(e.getTarget());
        var value = this.getValue();
        var newValue = new Date(day.getAttribute("value"));
        this.setValue(newValue);
        this.emit("changeValue", newValue);
      }, this);
    },


    _getTable : function(date) {
      var controls = qxWeb.template.render(this.getTemplate("controls"), this._getControlsData(date));
      var dayRow = qxWeb.template.render(this.getTemplate("dayRow"), this._getDayRowData(date));


      var data = {
        thead: controls + dayRow,
        tbody: this._getWeekRows(date)
      };

      return qxWeb.template.render(this.getTemplate("table"), data);
    },


    _getControlsData : function(date) {
      return {
        month: this.getTemplate("monthNames")[date.getMonth()],
        year: date.getFullYear()
      }
    },

    _getDayRowData : function(date) {
      return {
        row: this.getTemplate("dayNames")
      };
    },


    _getWeekRows : function(date) {
      var weeks = [];
      var startOfWeek = 1;

      var helpDate = new Date(date.getFullYear(), date.getMonth(), 1);

      var firstDayOfWeek = helpDate.getDay();
      var today = new Date();

      helpDate = new Date(date.getFullYear(), date.getMonth(), 1, 12, 0, 0);
      var nrDaysOfLastMonth = (7 + firstDayOfWeek - startOfWeek) % 7;
      helpDate.setDate(helpDate.getDate() - nrDaysOfLastMonth);

      for (var week=0; week<6; week++) {
        var data = {row: []};

        for (var i=0; i<7; i++) {
          var cssClasses = helpDate.getMonth() !== date.getMonth() ? "othermonth" : "";
          if (this.getProperty("value")) {
            cssClasses += helpDate.toDateString() === this.getProperty("value").toDateString() ? " selected" : "";
          }
          cssClasses += today.toDateString() === helpDate.toDateString() ? " today" : "";

          data.row.push({
            day: helpDate.getDate(),
            date: helpDate.toDateString(),
            cssClass: cssClasses
          });
          helpDate.setDate(helpDate.getDate() + 1);
        }

        weeks.push(qxWeb.template.render(this.getTemplate("row"), data));
      }

      return weeks.join("");
    }


  },


  defer : function(statics) {
    qxWeb.$attach({
      calendar : function(date) {
        var calendar =  new qx.module.ui.Calendar(this);

        if (date != undefined) {
          calendar.setValue(date);
        }

        return calendar;
      }
    });
  }
});

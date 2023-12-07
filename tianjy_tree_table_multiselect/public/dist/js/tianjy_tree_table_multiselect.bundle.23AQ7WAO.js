(() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

  // ../tianjy_tree_table_multiselect/tianjy_tree_table_multiselect/public/js/create.js
  function create(Class) {
    return class ControlTianjyTreeTableMultiSelect extends Class {
      make_input() {
        super.make_input();
        this.awesomplete.destroy();
        this.$input.css("background-color", "var(--control-bg)");
        this.$input_area.addClass("form-control tree-table-multiselect");
        this.$input.on("click", (e) => {
          this.create_dialog();
        });
      }
      async create_dialog() {
        const me = this;
        const dialog = new frappe.ui.Dialog({
          title: __(this.df.label),
          fields: [
            {
              label: "Filter",
              fieldtype: "Data",
              fieldname: "filter",
              onchange: async function() {
                const filterString = this.get_value("filter");
                me.tree.jstree(true).search(filterString);
              }
            },
            {
              fieldtype: "HTML",
              fieldname: "html"
            }
          ],
          primary_action: (values) => {
            const selected = this.tree.jstree(true).get_selected(true);
            const link_field = this.get_link_field();
            const deleteRows = this.rows.filter((item) => !selected.some((each) => each.id === item[link_field.fieldname]));
            const createRows = selected.filter((item) => !this.rows.some((each) => each[link_field.fieldname] === item.id));
            this.frm.doc[this.df.fieldname] = this.frm.doc[this.df.fieldname].filter((row) => !deleteRows.some((item) => item[link_field.fieldname] === row[link_field.fieldname]));
            const value = this.get_multi_data(createRows);
            this.parse_validate_and_set_in_model(value);
            dialog.hide();
          }
        });
        const selectOptions = await this.get_select_options();
        this.init_tree(dialog.fields_dict.html.$wrapper, selectOptions);
        dialog.show();
      }
      init_tree(wrapper, data) {
        this.tree = wrapper;
        this.tree.css("max-height", "600px");
        this.tree.css("overflow", "auto");
        this.tree.jstree({
          core: {
            data,
            check_callback: true
          },
          plugins: ["checkbox", "search"],
          search: {
            show_only_matches: false
          },
          checkbox: {
            three_state: false,
            keep_selected_style: true,
            tie_selection: true,
            whole_node: true
          }
        });
      }
      refresh_tree_data(options) {
        this.tree.jstree(true).settings.core.data = options;
        this.tree.jstree(true).refresh();
      }
      async get_select_options(filterString = "") {
        const doctype = this.get_options();
        if (!doctype) {
          return;
        }
        const args = {
          txt: filterString,
          doctype
        };
        const res = await frappe.call({
          type: "POST",
          method: "tianjy_tree_table_multiselect.tianjy_tree_table_multiselect.tianjy_tree_table_multiselect.get_select_options",
          args
        });
        const link_field = this.get_link_field();
        return ((res == null ? void 0 : res.message) || []).map((item) => __spreadProps(__spreadValues({}, item), {
          state: {
            opened: true,
            selected: this.value.some((each) => each[link_field.fieldname] === item.id),
            checked: this.value.some((each) => each[link_field.fieldname] === item.id)
          }
        }));
      }
      get_multi_data(value) {
        if (!this.rows) {
          return value;
        }
        const link_field = this.get_link_field();
        for (const item of value) {
          if (this.frm) {
            const new_row = frappe.model.add_child(this.frm.doc, this.df.options, this.df.fieldname);
            new_row[link_field.fieldname] = item.id;
            this.rows = this.frm.doc[this.df.fieldname];
          } else {
            this.rows.push({
              [link_field.fieldname]: item.id
            });
          }
          frappe.utils.add_link_title(link_field.options, item.id, item.text);
        }
        this._rows_list = this.rows.map((row) => row[link_field.fieldname]);
        return this.rows;
      }
    };
  }

  // ../tianjy_tree_table_multiselect/tianjy_tree_table_multiselect/public/js/controls.js
  frappe.ui.form.ControlTianjyTreeTableMultiSelect = create(frappe.ui.form.ControlTableMultiSelect);

  // ../tianjy_tree_table_multiselect/tianjy_tree_table_multiselect/public/js/tianjy_tree_table_multiselect.bundle.js
  frappe.model.no_value_type.push("Tianjy Tree Table MultiSelect");
})();
//# sourceMappingURL=tianjy_tree_table_multiselect.bundle.23AQ7WAO.js.map

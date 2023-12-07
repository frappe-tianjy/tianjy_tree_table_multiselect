frappe.provide('frappe.form.formatters');

Object.assign(frappe.form.formatters, {
	TianjyRelatedLink: function (value, docfield, options, doc) {
		let doctype = (docfield._options || docfield.options).split('\n').find(Boolean);
		let original_value = value;
		let link_title = frappe.utils.get_link_title(doctype, value);

		if (value && value.match && value.match(/^['"].*['"]$/)) {
			value.replace(/^.(.*).$/, '$1');
		}

		if (options && (options.for_print || options.only_value)) {
			return link_title || value;
		}

		if (frappe.form.link_formatters[doctype]) {
			// don't apply formatters in case of composite (parent field of same type)
			if (doc && doctype !== doc.doctype) {
				value = frappe.form.link_formatters[doctype](value, doc, docfield);
			}
		}

		if (!value) {
			return '';
		}
		if (value[0] == "'" && value[value.length - 1] == "'") {
			return value.substring(1, value.length - 1);
		}
		if (docfield && docfield.link_onclick) {
			return repl('<a onclick="%(onclick)s" href="#">%(value)s</a>', {
				onclick: `${docfield.link_onclick.replace(/"/g, '&quot;')}; return false;`,
				value: value,
			});
		} else if (docfield && doctype) {
			if (frappe.model.can_read(doctype)) {
				const a = document.createElement('a');
				a.href = `/app/${encodeURIComponent(
					frappe.router.slug(doctype),
				)}/${encodeURIComponent(original_value)}`;
				a.dataset.doctype = doctype;
				a.dataset.name = original_value;
				a.dataset.value = original_value;
				a.innerText = __((options && options.label) || link_title || value);
				return a.outerHTML;
			}
			return link_title || value;

		}
		return link_title || value;

	},
	TianjyTableRelatedMultiSelect: function (rows, df, options) {
		rows = rows || [];
		const meta = frappe.get_meta(df.options);
		const link_field = meta.fields.find(df => df.fieldtype === 'Tianjy Related Link');
		const formatted_values = rows.map(row => {
			const value = row[link_field.fieldname];
			return frappe.format(value, link_field, options, row);
		});
		return formatted_values.join(', ');
	},
});

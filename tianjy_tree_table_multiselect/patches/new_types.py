import frappe
import frappe.model
import frappe.model.create_new
import frappe.model.meta
import frappe.core.report.permitted_documents_for_user.permitted_documents_for_user
import frappe.desk.form.load
from frappe.database.mariadb.database import MariaDBDatabase




import frappe.utils.formatters
import frappe

from frappe.utils import formatdate
from frappe.core.doctype.docfield.docfield import DocField
from frappe.model.base_document import table_fields
# 增加自定义类型
data_fieldtypes = ("Tianjy Tree Table MultiSelect",)
frappe.model.meta.no_value_fields += data_fieldtypes
frappe.model.meta.table_fields += data_fieldtypes

frappe.model.no_value_fields += data_fieldtypes
frappe.model.table_fields += data_fieldtypes
frappe.model.base_document.table_fields += data_fieldtypes

old_get_link_doctype = DocField.get_link_doctype

def get_link_doctype(self):
	link = old_get_link_doctype(self)
	if self.fieldtype == "Tianjy Tree Table MultiSelect":
			table_doctype = self.options

			link_doctype = frappe.db.get_value(
				"DocField",
				{"fieldtype": "Link", "parenttype": "DocType", "parent": table_doctype, "in_list_view": 1},
				"options",
			)

			return link_doctype
	return link
DocField.get_link_doctype = get_link_doctype

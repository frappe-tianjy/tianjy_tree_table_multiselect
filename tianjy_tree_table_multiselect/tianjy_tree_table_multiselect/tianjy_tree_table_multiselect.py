import frappe
from guigu.tree import get_tree_group_field

@frappe.whitelist()
def get_select_options(txt, doctype):
	doctype_doc = frappe.get_doc('DocType', doctype)
	order_by = 'lft asc' if doctype_doc.is_tree else 'modified asc'
	data_list = frappe.get_list(doctype, filters=[
		[doctype_doc.title_field or 'name', 'like', '%'+txt+'%'],
	], fields=['*'], ignore_permissions=True, order_by=order_by)
	

	if txt != '' and txt is not None:
		data_list = get_ancestor(data_list, doctype)
	format_data_list = format_data(data_list, doctype_doc)
	return format_data_list

def get_ancestor(data_list, doctype):
	tree_group_field = get_tree_group_field(doctype)
	for item in data_list:
		for s in data_list:
			tree_group_judge = True
			if tree_group_field != '':
				tree_group_judge = s[tree_group_field] == item[tree_group_field]
			if s['lft'] < item['lft'] and s['rgt'] > item['rgt'] and tree_group_judge:
				data_list.remove(s)
	ancestors = []
	for filter_data in data_list:
		ancestor_filter = [{
			'lft': ['<=', filter_data['lft']],
		}, {
			'rgt': ['>=', filter_data['rgt']]
		}]
		if tree_group_field is not None and tree_group_field != '':
			ancestor_filter.append({
				tree_group_field: ['=', filter_data[tree_group_field]]
			})
		ancestor_filter = ancestor_filter
		item_ancestors = frappe.db.get_list(
			doctype,
			fields=['*'],
			filters=ancestor_filter,
			order_by="lft asc",
			limit=0,
		)
		ancestors = ancestors+item_ancestors
	unique_ancestors = []
	for ancestor in ancestors:
		if ancestor not in unique_ancestors:
			unique_ancestors.append(ancestor)
	return unique_ancestors

def format_data(data_list, doctype_doc):
	format_data_list = []
	for data in data_list:
		if doctype_doc.nsm_parent_field:
			parent = data.get(doctype_doc.nsm_parent_field) if data.get(doctype_doc.nsm_parent_field) else '#'
		else:
			parent = '#'
		format_data_list.append({
			'id':data.name,
			'parent':parent,
			'text':data.get(doctype_doc.title_field) if doctype_doc.title_field else data.name,
			'icon':False,
		})
	return format_data_list

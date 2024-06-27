using System.Collections.Generic;
using System.Text;

namespace MinecraftTropicalFishGen
{
	internal class Advancement
	{
		public string? Parent { get; set; }
		public string? IconItemId { get; set; }
		public string? IconCustomModelData { get; set; }
		public string? Title { get; set; }
		public string? Description { get; set; }
		public string? Background { get; set; }
		public string Frame { get; set; } = "task";
		public bool ShowToast { get; set; } = true;
		public bool AnnounceToChat { get; set; } = true;
		public bool Hidden { get; set; } = false;
		public Dictionary<string, CriteriaData> Criteria { get; set; } = [];
		public string? RewardFunction { get; set; }

		public string GetJson()
		{
			StringBuilder json = new();
			StringBuilder criteriaJson = new();

			json.AppendLine("{");

			if (Parent != null) json.AppendLine("\t\"parent\": \"" + Parent + "\",");

			json.AppendLine("\t\"display\": {");

			json.AppendLine("\t\t\"icon\": {");
			if (IconCustomModelData == null)
			{
				json.AppendLine("\t\t\t\"id\": \"" + IconItemId + "\"");
			}
			else
			{
				json.AppendLine("\t\t\t\"id\": \"" + IconItemId + "\",");
				json.AppendLine("\t\t\t\"components\": {");
				json.AppendLine("\t\t\t\t\"minecraft:custom_model_data\": " + IconCustomModelData);
				json.AppendLine("\t\t\t}");
			}
			json.AppendLine("\t\t},");

			json.AppendLine("\t\t\"title\": \"" + Title + "\",");
			json.AppendLine("\t\t\"description\": \"" + Description + "\",");
			json.AppendLine("\t\t\"frame\": \"" + Frame + "\",");

			if (Background != null) json.AppendLine("\t\t\"background\": \"" + Background + "\",");

			json.AppendLine("\t\t\"show_toast\": " + ShowToast.ToString().ToLower() + ",");
			json.AppendLine("\t\t\"announce_to_chat\": " + AnnounceToChat.ToString().ToLower() + ",");
			json.AppendLine("\t\t\"hidden\": " + Hidden.ToString().ToLower());

			json.AppendLine("\t},");
			json.AppendLine("\t\"criteria\": {");
			foreach (string criteriaName in Criteria.Keys)
			{
				if (criteriaJson.Length > 0) criteriaJson.AppendLine(",");

				CriteriaData c = Criteria[criteriaName];
				criteriaJson.AppendLine("\t\t\"" + criteriaName + "\": {");
				criteriaJson.AppendLine("\t\t\t\"trigger\": \"" + c.Trigger + "\"");
				criteriaJson.Append("\t\t}");
			}
			if (criteriaJson.Length > 0) json.AppendLine(criteriaJson.ToString());

			if (RewardFunction != null)
			{
				json.AppendLine("\t},");
				json.AppendLine("\t\"rewards\": {");
				json.AppendLine("\t\t\"function\": \"" + RewardFunction + "\"");
			}
			json.AppendLine("\t}");

			json.AppendLine("}");

			return json.ToString();
		}
	}
}